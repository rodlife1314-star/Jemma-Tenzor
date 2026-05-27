#!/usr/bin/env python3
import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

class TestAllocatorBoundary(unittest.TestCase):
    def test_vram_limit_calculation(self):
        from jemma_tenzor.runtime.allocator import CUDAAllocatorContext
        allocator = CUDAAllocatorContext(target_vram_gb=16.0, safety_margin_pct=0.80)
        diag = allocator.diagnose_hardware_allocation()
        
        self.assertEqual(diag["total_physical_vram_gb"], 16.0)
        self.assertEqual(diag["safety_envelope_pct"], 80.0)
        self.assertLess(diag["usable_vram_gb"], 16.0)

if __name__ == '__main__':
    unittest.main()
