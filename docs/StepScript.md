# StepScript

> Step script is Biphub's way of describing steps of tasks defined by the
> users. It is designed to be human readable and scalable,
> which can be used globally within the system.

Example of StepScript

Specs:
- StepScript must be in JSON array format

```
[
  {
    // Ordinary step
    id: <uuid> or <user defined: unique within this StepScript>,
    description: 'Description about the step',
    trigger: 'event', // type of trigger <event|poll|invoke>. First step must be either event or poll
    triggerId: <triggerId>,
    options: {}, // any options
    templates: {},
    editing: <boolean>, // flag to tell if user is currently editing this step
    lastEditingStep: <index>, // index of last editing step
    nextStep: <uuid> or <user defined: unique id>
  },
  {
    // Parallel step
    id: <uuid> or <user defined: unique within this StepScript>,
    description: 'Description about the step',
    tasks: [<uuid>, <uuid>] // these tasks will be executed in parallel. These ids must be visible immediately after this step
  }
]
```