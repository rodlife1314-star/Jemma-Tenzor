#!/usr/bin/env python3
import unittest
import json
import os

class TestTokenizerReference(unittest.TestCase):
    def test_utf8_boundary_protection(self):
        # A standard UTF-8 continuation byte starts with bits '10xxxxx' (decimal 128 to 191)
        # We test a simple character correction sliding offset boundary logic.
        raw_bytes = bytes([
            0x48, 0x65, 0x6c, 0x6c, 0x6f, # "Hello" (all single byte)
            0xf0, 0x9f, 0x98, 0x8a        # Smiling Face Emoji (4 bytes: F0 9F 98 8A)
        ])
        
        # If we split exactly at offset 6 (which is in the middle of the emoji multi-byte sequence)
        split_idx = 6
        
        # Boundary Correction Step:
        # Check if byte is a continuation byte: (b & 0xC0) == 0x80
        while split_idx > 0 and (raw_bytes[split_idx] & 0xC0) == 0x80:
            split_idx -= 1
            
        # The split index should have shifted left from 6 to 5 (the start of the 4-byte sequence)
        self.assertEqual(split_idx, 5)
        self.assertEqual(raw_bytes[:split_idx].decode('utf-8'), "Hello")

    def test_sliding_window_boundaries(self):
        # Sample document with distinct sentences
        doc = "This is sentence one. This is sentence two! And sentence three?"
        sentences = ["This is sentence one.", "This is sentence two!", "And sentence three?"]
        
        # Check simple segmentation boundaries
        split_sentences = [s.strip() for s in doc.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        self.assertEqual(len(split_sentences), 3)

    def test_profile_schema_validation(self):
        # Load and verify JSON schema structure
        schema_path = os.path.join(os.path.dirname(__file__), '../external/TensorRT-Edge-LLM/tokenizer_reference/tokenizer_profile.schema.json')
        self.assertTrue(os.path.exists(schema_path))
        
        with open(schema_path, 'r') as f:
            schema = json.load(f)
            
        self.assertEqual(schema["title"], "TokenizerProfile")
        self.assertIn("vocab_size", schema["properties"])
        self.assertIn("max_sequence_length", schema["properties"])

if __name__ == '__main__':
    unittest.main()
