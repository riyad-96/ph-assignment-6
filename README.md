### Questions

#### 1) What is the difference between var, let, and const?

#### 2) What is the difference between map(), forEach(), and filter()?

#### 3) What are arrow functions in ES6?

#### 4) How does destructuring assignment work in ES6?

#### 5) Explain template literals in ES6. How are they different from string concatenation?

### Answers

#### 1. Difference between var, let and const is in Scope, Re-declaration and Re-assignment.

- Scope
  - `var`: Function scoped, if declared outside the function it becomes global.
  - `let`: Block scoped, only accessible inside that declared block scope.
  - `const`: same as `let`.

- Re-declaration:
  - `var`: `var` can be Re-declared with same name. e.g. `var speech = 'Hello world';` again `var speech = 'Hello coders';`
  - `let`: `let` can't be Re-declared. e.g. `let speech = 'Hello world';` again `let speech = 'Hello coders';` now we get an error.
  - `const`: same as `let`.

- Re-assignment:
  - `var`: `var` can be Re-assigned. e.g. `var speech = 'Hello world';` and we can do `speech = 'Hello coders';`
  - `let`: same as `var`
  - `const`: `const` can't be Re-assigned. e.g. `const speech = 'Hello world';` again `speech = 'Hello coders';` now we get an error.

#### 2. Difference between `map()`, `forEach()` and `filter()`:

- `map()`, `forEach()` and `filter()` are array methods.
  - `map()`: is a loop that can do some specific task with each element of array and return a new array with those new elements stored in. a return statement is required.
  - `forEach()`: is also a loop that can perform tasks for each elements of a specific array. it returns nothing.
  - `filter()`: a loop that can return a new array based on a condition provided to it.

#### 3. Arrow function in ES6:

- Arrow function is a shorter way of writing functions without `function` keyword.

#### 4. Destructuring allows to get value from array or object in a single line as a variable.

- Array:

```javascript
const arr = [1, 2];
// now we can do
const [a, b] = arr;
//then
console.log(a, b); // 1 2;
```

- Object:

```javascript
const obj = { name: 'Riyad', age: '23' };
// now we can do
const { name, age } = obj;
// or
const { name: userName, age: userAge } = obj;
// then
console.log(name, age); // Riyad 23
console.log(userName, userAge); // Riyad 23
```

#### 5. Template literals in ES6 made dev life easier

- Instead of using `+` to concatenate strings that is not very reading friendly, we can use template literals to add variables straight into strings.

```javascript
const a = 'Hello';
const b = 'coders';
const templateLiteral = `${a} to all the ${b}.`;
console.log(templateLiteral); // Hello to all the coders.
```
