# Biphub
> Biphub is aimed to help people easily automate workflow between APIs
> on their on-premise hardware instead of relying on SaaS solutions

# Pod specification

manifest.json

| key             | Description |
| --------------- | ------------------------------------------------------------------------ |
| name            | Identifier of the pod used by hub. This value has to be globally unique  |
| title           | Name used for display purpose  |
| url             | Official link to the Pod |
| icon            | Main icon of the app |
| preparedConfig  | Configurations prepared beforehand |
| auth            | Authentication strategy used by the pod |
| actions         | List of pod actions (e.g. post a message) |


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

- Available Pod Authentications

strategyType: token | oauth
properties: 