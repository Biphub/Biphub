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
- StepScript must be in JSON format
- Start of the script always be in JSON Array format

```
[
  {

  }
]
```
