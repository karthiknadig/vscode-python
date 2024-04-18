# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

from testscenarios import TestWithScenarios

class TestMathOperations(TestWithScenarios):
    scenarios = [
        ('add', {'test_id': 'test_add', 'a': 5, 'b': 3, 'expected': 8}),
        ('subtract', {'test_id': 'test_subtract', 'a': 5, 'b': 3, 'expected': 2}),
        ('multiply', {'test_id': 'test_multiply', 'a': 5, 'b': 3, 'expected': 15})
    ]
    a = None
    b = None
    expected = None
    test_id = None

    def test_operations(self):
        result = None
        if self.test_id == 'test_add':
            result = self.a + self.b
        elif self.test_id == 'test_subtract':
            result = self.a - self.b
        elif self.test_id == 'test_multiply':
            result = self.a * self.b
        self.assertEqual(result, self.expected)
