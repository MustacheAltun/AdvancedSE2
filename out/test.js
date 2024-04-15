"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = __importDefault(require("immutable"));
const Fun = (actual) => {
    const f = actual;
    f.then = function (other) {
        return Fun(input => other(this(input)));
    };
    return f;
};
const apply = () => Fun(([f, a]) => f(a));
const Updater = Fun;
const id = () => Fun(x => x);
const Person = {
    Updaters: {
        fullName: (fieldUpdater) => Updater(person => (Object.assign(Object.assign({}, person), { fullName: fieldUpdater(person.fullName) }))),
        age: (fieldUpdater) => Updater(person => (Object.assign(Object.assign({}, person), { age: fieldUpdater(person.age) }))),
    }
};
const Course = {
    Updaters: {
        teacher: (fieldUpdater) => Updater(course => (Object.assign(Object.assign({}, course), { teacher: fieldUpdater(course.teacher) }))),
        students: (fieldUpdater) => Updater(course => (Object.assign(Object.assign({}, course), { students: fieldUpdater(course.students) }))),
    }
};
const isStringEmpty = Updater((s) => s.length == 0);
const doctorify = Updater((s) => `Dr ${s}`);
const incr = Fun((x) => x + 1);
const decr = Fun((x) => x - 1);
const double = Fun((x) => x * 2);
const gtz = Fun((x) => x > 0);
const neg = Fun((x) => !x);
const course = {
    teacher: { id: "gm", fullName: "Giuseppe Maggiore", age: 38 },
    students: immutable_1.default.Map()
};
const Countainer = (data) => (Object.assign(Object.assign({}, data), { map: function (f) { return map_Countainer(f)(this); } }));
const increment = (input) => (Object.assign(Object.assign({}, input), { counter: input.counter + 1 }));
const map_Countainer = (f) => Fun(input => Countainer(Object.assign(Object.assign({}, input), { content: f(input.content) })));
// operations on specific countainers
const tmp = map_Countainer(doctorify.then(isStringEmpty)).then(Fun(increment));
// values of actual countainers in memory...
const c_n = Countainer({ content: 0, counter: 0 });
const c_s = Countainer({ content: "Content", counter: 0 });
const map_Id = (f) => f;
const Option = {
    Default: {
        Empty: () => ({ kind: "empty", then: function (f) { return then_Option(this, f); } }),
        Full: (content) => ({ kind: "full", content: content, then: function (f) { return then_Option(this, f); } }),
    }
};
const map_Option = (f) => Fun(input => input.kind == "empty" ? Option.Default.Empty() : Option.Default.Full(f(input.content)));
const map_Array = (f) => Fun(input => input.map(f));
const Functor = (f) => f;
const Then = (f, g) => ({ Before: f, After: g });
const mappings = {
    Id: map_Id,
    Array: map_Array,
    Countainer: map_Countainer,
    Option: map_Option
};
const map = (F) => typeof (F) == "string" && F in mappings ? mappings[F]
    : "After" in F && "Before" ?
        (f) => map(F["Before"])(map(F["After"])(f))
        : null;
const m1 = map(Functor("Array"));
const m2 = map(Then("Countainer", Functor("Option")))(incr.then(gtz));
const AACO = Then("Array", Then("Array", Then("Countainer", Functor("Option"))));
const AAO = Then("Array", Then("Array", Functor("Option")));
const m3 = map(AACO)(incr.then(gtz));
const associate = () => Fun(([a, [b, c]]) => [[a, b], c]);
const map2_Pair = (l, r) => Fun(p => [l(p[0]), r(p[1])]);
const mkPair = (l, r) => Fun(c => [l(c), r(c)]);
const stringPlus = {
    join: Fun(([s1, s2]) => s1 + s2),
    getZero: Fun((_) => "")
};
const numberPlus = {
    join: Fun(([s1, s2]) => s1 + s2),
    getZero: Fun((_) => 0)
};
// const borkedMonoid : Monoid<number> = {
//   join:Fun(([s1,s2]:Pair<number,number>) => s1+s2),
//   getZero:Fun((_:Unit) => 1)
// }
const identityLaw = (m, samples) => {
    const pointlessPath1 = mkPair(m.getZero, id()).then(m.join);
    const pointlessPath2 = mkPair(id(), m.getZero).then(m.join);
    samples.forEach(s => {
        if (s != pointlessPath1(s))
            console.error("m is not a monoid!!!");
        if (s != pointlessPath2(s))
            console.error("m is not a monoid!!!");
    });
};
const OptionMonad = {
    unit: () => Fun((Option.Default.Full)),
    join: () => Fun(o2 => o2.kind == "empty" ? Option.Default.Empty() : o2.content.kind == "empty" ? Option.Default.Empty() : Option.Default.Full(o2.content.content))
};
const then_Option = (p, f) => map_Option(Fun(f)).then(OptionMonad.join())(p);
const maybeAdd = (x, y) => x.then(x_v => y.then(y_v => Option.Default.Full(x_v + y_v)));
const State = (actual) => {
    const tmp = actual;
    tmp.then_State = function (f) {
        return then_State(this, f);
    };
    return tmp;
};
let map_State = (f) => Fun(p0 => State(p0.then(map2_Pair(f, id()))));
const StateMonad = () => ({
    unit: () => Fun(a => State(Fun(s0 => [a, s0]))),
    join: () => Fun(p_p => State(p_p.then(apply()))),
    getState: () => State(Fun(s0 => [s0, s0])),
    setState: (newState) => State(Fun(_ => [{}, newState])),
    updateState: (stateUpdater) => State(Fun(s0 => [{}, stateUpdater(s0)])),
});
const then_State = (p, f) => map_State(Fun(f)).then(StateMonad().join())(p);
const Memory = {
    Default: ({ a: 0, b: 0, c: "c", d: "d" }),
    a: (_) => Fun(current => (Object.assign(Object.assign({}, current), { a: _(current.a) }))),
    b: (_) => Fun(current => (Object.assign(Object.assign({}, current), { b: _(current.b) }))),
    c: (_) => Fun(current => (Object.assign(Object.assign({}, current), { c: _(current.c) }))),
    d: (_) => Fun(current => (Object.assign(Object.assign({}, current), { d: _(current.d) }))),
};
const Ins = Object.assign(Object.assign({}, StateMonad()), { getVar: (k) => Ins.getState().then_State(current => Ins.unit()(current[k])), setVar: (k, v) => Ins.updateState(current => (Object.assign(Object.assign({}, current), { [k]: v }))) });
// Ins.updateState(currentState => ({...currentState, a:currentState.a+1})).then_State(() => 
//   Ins.updateState(currentState => ({...currentState, b:currentState.b+1}))
// )
const myProgram1 = Ins.getVar("a").then_State(a => Ins.setVar("a", a + 1).then_State(() => Ins.getVar("c").then_State(c => Ins.getVar("d").then_State(d => Ins.setVar("c", c + d)))));
const thenMaybe = (f, g) => f.kind == "full" && g.kind == "full" ? Option.Default.Full(f.content.then(g.content))
    : f.kind == "full" ? f : g;
const Coroutine = () => ({
    // constructors
    Default: (actual) => {
        const result = actual;
        result.then = function (k) { return Coroutine().then(this, Fun(k)); };
        return result;
    },
    Result: (value) => Coroutine().Default((_) => CoroutineStep().Result(value)),
    Suspend: () => Coroutine().Default((_) => CoroutineStep().Suspend(Coroutine().Result({}))),
    Wait: (msLeft) => Coroutine().Default((_) => CoroutineStep().Wait(msLeft, Coroutine().Result({}))),
    GetState: () => Coroutine().Default(([context, deltaT]) => CoroutineStep().Result(context)),
    SetState: (updateState) => Coroutine().Default(([context, deltaT]) => CoroutineStep().SetState(updateState)),
    // combinators
    Tick: (context, deltaT, p) => {
        const step = p([context, deltaT]);
        if (step.kind == "result") {
            return { kind: "done", result: step.value, updateState: step.updateState };
        }
        else if (step.kind == "suspend") {
            return { kind: "continuing", next: step.next, updateState: step.updateState };
        }
        else {
            if (step.msLeft <= deltaT)
                return { kind: "continuing", next: step.next, updateState: step.updateState };
            else
                return { kind: "continuing", next: Coroutine().Wait(step.msLeft - deltaT).then(() => step.next), updateState: step.updateState };
        }
    },
    Seq: (ps) => ps.length <= 0 ? Coroutine().Result({}) : ps[0].then(() => Coroutine().Seq(ps.slice(1))),
    Repeat: (p) => p().then(() => Coroutine().Repeat(p)),
    Any: (ps) => {
        return Coroutine().Default(([context, deltaT]) => {
            const ps1 = [];
            let nextState = Option.Default.Empty();
            for (const p of ps) {
                const step = Coroutine().Tick(context, deltaT, p);
                nextState = thenMaybe(nextState, step.updateState);
                if (step.kind == "done")
                    return { kind: "result", value: step.result, updateState: nextState };
                else {
                    ps1.push(step.next);
                }
            }
            return { kind: "suspend", next: Coroutine().Any(ps1), updateState: nextState };
        });
    },
    // functoriality and monadicity
    map: (f) => Fun(p => Coroutine().Default(Fun(p).then(CoroutineStep().map(f)))),
    join: (pp) => Coroutine().Default(([context, deltaT]) => {
        const step = pp([context, deltaT]);
        if (step.kind == "result") {
            const step1 = step.value([context, deltaT]);
            return Object.assign(Object.assign({}, step1), { updateState: thenMaybe(step.updateState, step1.updateState) });
        }
        else {
            const joinedNext = Coroutine().join(step.next);
            return Object.assign(Object.assign({}, step), { next: joinedNext });
        }
    }),
    then: (p, k) => Coroutine().join(Coroutine().map(k)(p)),
});
const CoroutineStep = () => ({
    SetState: (updateState) => ({ kind: "result", value: {}, updateState: Option.Default.Full(updateState) }),
    Result: (value) => ({ kind: "result", value: value, updateState: Option.Default.Empty() }),
    Suspend: (next) => ({ kind: "suspend", next: next, updateState: Option.Default.Empty() }),
    Wait: (msLeft, next) => ({ kind: "waiting", next: next, msLeft: msLeft, updateState: Option.Default.Empty() }),
    map: (f) => Fun(cs => cs.kind == "result" ? Object.assign(Object.assign({}, cs), { value: f(cs.value) }) : Object.assign(Object.assign({}, cs), { next: Coroutine().map(f)(cs.next) }))
});
// > You may use the various functions and types we have seen in class: `Fun`, `Countainer`, `mapCountainer`, `mapOption`, `incr`, `decr`, etc.
// # Question - defining simple functions. Examples of the question:
// Write a Fun<number,number> which multiplies the input by three. 
// Write a Fun<[number,number],number> which performs a sum.
// Write a Fun<[boolean,boolean],boolean> which performs a logical and.
const batata1 = Fun(x => x * 3);
const batata2 = Fun(([x, y]) => x + y);
const batata3 = Fun(([x, y]) => x && y);
// # Typing simple functions.
// What is the type of Fun(x => x + 1)?  Fun<number,number>
// What is the type of Fun(x => x > 0)? Fun<number,boolean>
// What is the type of Fun(x => !x)? Fun<boolean,boolean>
// What is the type of Fun(([x,y]) => x * y + 1)? Fun<[number,number],number>
// What is the type of Fun(([x,y]) => x + ", " + y)? Fun<[string,string],string>
// # Defining a chain of functions with composition. 
// Define a chain function that increments, doubles, and then decrements 
// Define a chain function that increments and then checks if the result is greater than zero
// Define a chain function that checks if a value is greater than zero and then flips the result
const chain1 = incr.then(double.then(decr));
const chain2 = incr.then(gtz);
const chain3 = gtz.then(neg);
// # Typing a chain of functions.
// What is the type of incr.then(gtz)? Fun<number,boolean>
// What is the type of incr.then(double)? Fun<number,number>
// What is the type of id.then(incr)? Fun<number,number>
// What is the type of gtz.then(not)? Fun<number,boolean>
// # Invoking a map function. 
// What is the value of mapId(incr)(id(10))? 11
// What is the value of mapArray(gtz)([1,-2,3,-4])? [true,false,true,false]
// What is the value of mapOption(f)(Option.Default.empty())? Option.Default.empty()
// What is the value of mapOption(gtz)(Option.Default.full(-5))? Option.Default.full(false)
// # Typing map functions.
// What is the type of mapId(incr)?  Fun<Id<number>,Id<number>>
// What is the type of mapArray(incr)? Fun<Array<number>,Array<number>>
// What is the type of mapOption(gtz)? Fun<Option<number>,Option<number>>
// # Composing map functions.
// Define a map function that transforms all the options inside an array.
// Define a map function that transforms the option inside a countainer.
// Define a map function that transforms all the countainers inside an option inside an array.
const transformer1 = function (x) { map_Array(map_Option(x)); };
const transformer2 = function (x) { map_Countainer(map_Option(x)); };
const transformer3 = function (x) { map_Array(map_Option(map_Countainer(x))); };
// Complete the definition of the `Fun` constructor (replace `[...]` with the correct code):
// ```ts
// function Fun< input, output >( implementation:(input:input) => output ) : Fun< input, output > {
//   const tmp = implementation as Fun<input, output>
//   tmp.then = nextStep => Fun(input => [...])
//   return tmp
// }
// ```
function Funs(implementation) {
    const tmp = implementation;
    tmp.then = nextStep => Fun(input => nextStep(tmp(input)));
    return tmp;
}
// # Defining functors
// Complete the definition of the following `map` function:
// ```ts
// const mapId = <a,b>(f:Fun<a,b>) : Fun<Id<a>, Id<b>> => [...]
// ```
const mapId = (f) => f;
// Complete the definition of the following `map` function:
// ```ts
// const mapArray = <a,b>(f:Fun<a,b>) : Fun<[...]> => Fun(inputArray => inputArray.map(f))
// ```
const mapArray = (f) => Fun(inputArray => inputArray.map(f));
// Complete the definition of the following `map` function:
// ```ts
// const mapCountainer = <a,b>(f:Fun<a,b>) : Fun<Countainer<a>, Countainer<b>> =>
//   Fun(inputCountainer => ({...inputCountainer, content:[...]}))
// ```
const mapCountainer = (f) => Fun(inputCountainer => Countainer(Object.assign(Object.assign({}, inputCountainer), { content: f(inputCountainer.content) })));
// Complete the definition of the following `map` function:
// ```ts
// const mapOption = <a,b>(f:Fun<a,b>) : Fun<Option<a>, Option<b>> =>
//   Fun(inputOption => inputOption.kind == [...] ? empty() : full(f(inputOption.content)))
// ```
const mapOption = (f) => Fun(inputOption => inputOption.kind == "empty" ? Option.Default.Empty() : Option.Default.Full(f(inputOption.content)));
// Complete the definition of the following `map` function:
// ```ts
// const mapList = <a,b>(f:Fun<a,b>) : Fun<[...]> => Fun(l => l.map(f))
// ```
const mapList = (f) => Fun(l => l.map(f));
const empty = () => ({ kind: "empty" });
const full = (content) => ({ kind: "full", content: content });
// # Defining monoids
// Complete the following monoid definition:
// ```ts
// (number,+,0) 
// ```
// Complete the following monoid definition:
// ```ts
// (number,*,1) 
// ```
// Complete the following monoid definition:
// ```ts
// (string,+,"") 
// ```
// Complete the following monoid definition:
// ```ts
// (Array<a>,concat,[]) 
// ```
// # Monads
// Complete the following definition:
// ```ts
// class OptionFunctor {
//   static join<T>(nestedValue:Option<Option<T>>) : Option<T> {
//     return nestedValue.kind == "empty" ? [...] : 
//       nestedValue.content.kind == "empty" ? [...] :
//       [...]
//   }
//   static unit<T>(unstructuredValue:T) : Option<T> {
//     return [...]
//   }
// }
// ```
class OptionFunctor {
    static join(nestedValue) {
        return nestedValue.kind == "empty" ? Option.Default.Empty() :
            nestedValue.content.kind == "empty" ? Option.Default.Empty() :
                Option.Default.Full(nestedValue.content.content);
    }
    static unit(unstructuredValue) {
        return Option.Default.Full(unstructuredValue);
    }
}
// Complete the following definition:
// ```ts
// class CountainerFunctor {
//   static join<T>(nestedValue:Countainer<Countainer<T>>) : Countainer<T> {
//     return ({ content:[...], counter:[...] })
//   }
//   static unit<T>(unstructuredValue:T) : Countainer<T> {
//     return Countainer(unstructuredValue)
//   }
// }
// ```
class CountainerFunctor {
    static join(nestedValue) {
        return Countainer({ content: nestedValue.content.content, counter: nestedValue.content.counter });
    }
    static unit(unstructuredValue) {
        return Countainer(unstructuredValue);
    }
}
const mapProcess = (f) => Fun(p0 => Fun(s0 => {
    const [s1, result] = p0(s0);
    const transformedResult = f(result);
    return [s1, transformedResult];
}));
class ProcessFunctor {
    static join(pp0) {
        return Fun(s0 => {
            const [s1, p1] = pp0(s0);
            return p1(s1);
        });
    }
    static unit(unstructuredValue) {
        return Fun(s => [s, unstructuredValue]);
    }
}
// # Advanced monads and functors
// Complete the following definition:
// ```tsx
// import React from "react";
// export type Widget<o> = {
//   run: (onOutput: (_: o) => void) => JSX.Element;
//   map: [...];
//   wrapHTML: (f: (_: JSX.Element) => JSX.Element) => Widget<o>;
// };
// export const Widget = {
//   Default: <o,>(actual: (onOutput: (_: o) => void) => JSX.Element): Widget<o> => ({
//     run: actual,
//     map: function <o2>(this: Widget<o>, f: (_: o) => o2): Widget<o2> {
//             return [...]
//         );
//       },
//     wrapHTML: function (this: Widget<o>, f: (_: JSX.Element) => JSX.Element): Widget<o> {
//         return Widget.Default(onOutput => f(this.run(onOutput))
//       );
//     }
//   }),
//   any: <o,>(ws: Array<Widget<o>>): Widget<o> => 
//     Widget.Default<o>(onOutput => 
//       <>{
//         ws.map(w => w.run(onOutput))
//       }</>
//     )
// };
// ```
// Complete the following type definitions
// ```ts
// export type Coroutine<context, state, events, result> = {
//   ([context, deltaT, events]: [context, DeltaT, Array<events>]): CoroutineStep<
//     context,
//     state,
//     events,
//     result
//   >;
// export type CoroutineStep<context, state, events, result> = {
//   newState: BasicUpdater<state> | undefined;
// } & (
//   | { kind: "result"; [...] }
//   | {
//       kind: "then";
//       p: Coroutine<context, state, events, any>;
//       k: BasicFun<any, Coroutine<context, state, events, result>>;
//     }
//   | { kind: "yield"; next: [...] }
//   | {
//       kind: "waiting";
//       msLeft: number;
//       next: [...];
//     }
// )
// ```
