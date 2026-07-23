import ollama

response = ollama.chat(
    model="gemma3:4b",
    messages=[
        {
            "role": "user",
            "content": "Read every handwritten word from this image.",
            "images": ["sample.jpeg"]   # Your image
        }
    ]
)

print(response["message"]["content"])