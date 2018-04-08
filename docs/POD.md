# Pod

Pod is a set of stateless functions that implements interaction with external 
APIs. Example of a pod can be "biphub-slack-pod" that can submit message to a 
channel, create channels and set up reminder. Also this pod can register a 
Webhook endpoint to Slack.

# Core concepts

### 1. Pod resource

Pod resource is a JSON file that contains all the necessary details that 
describes title, actions, authentications and pod styles.

| name                                              | Description |
|---------------------------------------------------|---|
| title                                             | Title of the pod  |
| description                                       | Some descriptions |
| url                                               | Url to the official site  |
| icon                                              | Name of pod icon image. To make it visible, you must located it under "images" folder of the pod itself. Make sure to name the image file same as the value of this field  |
| styles                                            | Custom styles |
| styles.background-color                           | Background color to be used when displaying the pod in Card component |
| config                                            | Configurations |
| podAuth                                           | List of authentications that the pod supports |
| podAuth.strategy                                  | At the moment supported strategies include: token and oAuth |
| actions                                           | List of actions; aka what the pod can do |
| actions.<name>.title                              | Title of the action |
| actions.<name>.description                        | Description of the action |
| actions.<name>.styles                             | Custom styles of the action |
| actions.<name>.styles.background_color            | Background color used when displaying the action as a card component |
| actions.<name>.exports.properties                 | List of return data of the action |
| actions.<name>.exports.properties.<property_name> | Properties, it contains data type and display title |
| actions.<name>.imports.properties                 | List of input data of the action |
| actions.<name>.imports.properties.<property_name> | Properties, it contains data type and display title |


### 2. Pod handler

Handler is a Javascript file that contains actual executable code. 
At the moment only Javascript (Node.js) is supported as a platform.


### 3. Static assets

Static assets such as pod logo can be located under folders such as "images"
