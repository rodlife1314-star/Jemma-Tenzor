#!/usr/bin/env python3
import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

class TestGatewayRoute(unittest.TestCase):
    def test_pydantic_payload_parsing(self):
        from jemma_tenzor.inference.gateway import InferencePayload
        
        payload = InferencePayload(prompt="Build a multi-stage Docker file", max_tokens=100)
        self.assertEqual(payload.prompt, "Build a multi-stage Docker file")
        self.assertEqual(payload.max_tokens, 100)

if __name__ == '__main__':
    unittest.main()
