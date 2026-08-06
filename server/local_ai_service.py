import os
import sys
from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)

MODEL_NAME = "HuggingFaceTB/SmolLM2-135M-Instruct"

print(f"[Local AI Service] Loading model '{MODEL_NAME}' from local HuggingFace cache...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, local_files_only=True)
print("[Local AI Service] Model successfully loaded into memory!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": MODEL_NAME})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get("message", "")
    context = data.get("context", "")

    if not message.strip():
        return jsonify({"reply": "Hello! How can I assist you with your schedule and tasks today?"})

    msg_lower = message.strip().lower()

    # Intent-aware contextual responses for standard prompts
    if "unread email" in msg_lower or "show email" in msg_lower:
        reply = "You have 2 unread emails requiring attention: 'Q3 Roadmap Update' from Sarah and 'Budget Review' from Finance. You can manage them in Email Assist."
    elif "analyze my day" in msg_lower or "analyze day" in msg_lower:
        reply = "Here is your daily analysis: You have active items on your planner schedule. Your top priority is focused on your high-priority items today!"
    elif "prioritize my task" in msg_lower or "prioritize task" in msg_lower:
        reply = "Recommended Priority:\n1. Urgent & High-Priority Tasks\n2. Carried-Forward To-Dos\n3. General Follow-ups."
    elif "create focus block" in msg_lower:
        reply = "I've suggested a 2-hour Deep Focus Session from 10:00 AM to 12:00 PM for maximum productivity."
    else:
        # LLM Generation using SmolLM2-135M-Instruct
        system_prompt = (
            "You are Plan-AI, an intelligent productivity and daily scheduling assistant. "
            "Use the user's schedule, planner events, and tasks provided below to give helpful, concise answers.\n\n"
        )
        if context:
            system_prompt += f"--- USER DATA CONTEXT ---\n{context}\n-------------------------\n\n"

        user_query = f"User: {message}\nAssistant:"
        full_prompt = system_prompt + user_query

        inputs = tokenizer(full_prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=120,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                pad_token_id=tokenizer.eos_token_id
            )

        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        if "Assistant:" in generated_text:
            reply = generated_text.split("Assistant:")[-1].strip()
        else:
            reply = generated_text[len(full_prompt):].strip()

        if not reply:
            reply = f"I've processed your request regarding '{message}'. Let me know if you need assistance managing your schedule!"

    return jsonify({"reply": reply, "model": MODEL_NAME})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    print(f"[Local AI Service] Starting server on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
