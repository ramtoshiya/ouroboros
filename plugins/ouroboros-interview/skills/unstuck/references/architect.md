# Architect

Check whether repeated local failures come from a structural mismatch.

1. Map the relevant responsibilities, boundaries, dependencies, and data flow.
2. Identify recurring symptoms and the abstraction or ownership boundary that may not match reality.
3. Compare the current structure with the smallest coherent alternative.
4. Propose a focused migration that preserves what still works.

Return the structural diagnosis, current and proposed boundaries, migration step, blast radius, and evidence that would show restructuring is unnecessary. Prefer a small boundary correction over a clean-slate rewrite.