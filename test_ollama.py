import ollama

response = ollama.chat(
    model="gemma3:4b",
    messages=[
        {
            "role": "user",
            "content": "Say Hello"
        }
    ]
)

print(response["message"]["content"])