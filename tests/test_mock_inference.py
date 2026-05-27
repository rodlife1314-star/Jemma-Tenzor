#!/usr/bin/env python3
import unittest
import sys
import os

# Put src in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

class TestMockInference(unittest.TestCase):
    def test_mock_tokenization(self):
        from jemma_tenzor.examples.throughput_bench import mock_tokenize
        tokens = mock_tokenize("Hello")
        self.assertEqual(len(tokens), 5)
        self.assertEqual(tokens[0], ord('H'))

    def test_dry_run_generation(self):
        prompt = "Test system integrity."
        from jemma_tenzor.examples.throughput_bench import mock_tokenize
        tokens = mock_tokenize(prompt)
        self.assertTrue(len(tokens) > 0)

if __name__ == '__main__':
    unittest.main()
