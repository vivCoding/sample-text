# Making Tests
We are using the `pytest` library for testing.

Tests should be written in the `backend/tests/` folder. An example/template test file can be in the same folder (named `test_example.py`). Follow the `TODOS` in the file for instructions.

**Conventions**:
- Test files should always be prefixed with `test_`
- Functions to run as tests should always be prefixed with `test_`
- `assert`s should always contain an error message for easier identification
    - e.g. `assert <condition>, "Failed test case!"`

# Running Tests
To run all tests, run `python runtest.py`.

To run a specifc tests, run `python runtest.py -t <path_to_test>`.

```
python runtest.py -t tests/example.py
```
