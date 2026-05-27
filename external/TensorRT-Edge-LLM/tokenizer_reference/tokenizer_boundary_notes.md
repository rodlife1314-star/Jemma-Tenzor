# Tokenizer Boundary and Sentence Splitting Reference

This technical note documents the design and math model for safe CPU-side pre-tokenization boundary checks, memory protection buffers, and UTF-8 safe chunking algorithms.

---

## 1. Context Length Overrun Prevention (CLOP)

When a model is compiled to a strict static sequence length $L_{max}$ (e.g., 2048 or 4096 tokens), sending input sequences exceeding $L_{max}$ will trigger engine crashes or attention cache allocation failures in TensorRT. 

To prevent this:
1.  **Strict Character Estimators**: Pre-scan the string and compute initial estimations based on AVERAGE token-to-char ratios ($R_{tc} \approx 4.0$).
2.  **Hard Truncation Interceptors**: CPU processing filters apply hard character caps ($C_{char} = L_{max} \times 3$) prior to passing strings to standard HuggingFace/Hera fast-tokenizers.

---

## 2. Dynamic Sliding Window Boundary Slicing

For documents exceeding the context envelope that require chunking (e.g., retrieval processing or summarization queues), chunks must be divided along logical sentence boundaries to preserve syntactic meaning.

### Chunk Splitting Algorithm
```python
def chunk_text_by_boundaries(text: str, max_chunk_tokens: int, overlap_tokens: int) -> list[str]:
    # 1. Split text into logical components using prioritized separators:
    #    - Double newline (Paragraph)
    #    - Period/Exclamation/Question plus space (Sentence)
    #    - Space (Word)
    # 2. Re-combine segments until the token boundary threshold is reached
    # 3. Inject a sliding overlap region to preserve contextual embeddings
```

---

## 3. UTF-8 Byte Fragment Protection

When dividing files or strings by byte offsets instead of character boundaries, a chunk boundary may fall in the middle of a multi-byte UTF-8 character. Attempting to decode this incomplete byte sequence results in Unicode decode failures.

### Prevention Protocol
- **Boundary Shift**: If a slice edge intersects a byte with standard high-order bit patterns `10xxxxxx` (a UTF-8 continuation byte), the boundary offset is decremented (shifted left) until it hits the start byte structure `11xxxxxx` or `0xxxxxxx`. This ensures invalid or corrupted characters are never submitted to the tokenizer pipeline.
