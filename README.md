# Monumento Angular Base

The building block of an angular project.


- [Monumento Angular Base](#monumento-angular-base)
  - [Install \& Usage](#install--usage)
    - [Commands:](#commands)
      - [Shared Component](#shared-component)
      - [Presentation Module](#presentation-module)
      - [Presentation Component](#presentation-component)
      - [Install PWA](#install-pwa)
    - [QA](#qa)
  - [Architecture](#architecture)
    - [Domain](#domain)
      - [Usecases](#usecases)
      - [Models](#models)
    - [Data](#data)
      - [Repositories:](#repositories)
      - [Entities:](#entities)
    - [Presentation](#presentation)
  - [Credits](#credits)


## Install & Usage

To install the aplication:

```sh
npm install
```

To run the application

```sh
ng serve
```
### Commands:

#### Shared Component
This command generates a shared component in the shared/components directory. It creates the necessary files and boilerplate code for the component.

```sh
make shared_component <component-name>
```

#### Presentation Module
This command generates a presentation module in the presentation directory. It creates the necessary files and sets up the module with routing.

```sh
make presentation_module <module-name>
```

#### Presentation Component
This command generates a presentation component in the presentation directory. It creates the necessary files and boilerplate code for the component.

```sh
make presentation_component <component-name>
```

#### Install PWA
This command Installs the pwa elements required to run a pwa

```sh
make install_pwa
```

### QA

To make quality tests.

```sh
ng serve --configuration=qa
```

## Architecture

This project is based on the **Clean Architecture** proposed by [Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). The primary objective of Clean Architecture is to separate the business rules from the application-specific and framework-specific details.

1. The user interface invokes the method in the **Presentation** layer, initiating a user action or interaction.

2. The **Presentation** layer receives the user **request** and **executes** the corresponding **usecase**.

3. The **usecase** combines the user data received from the interface with the relevant **Repository**.

4. Each **Repository** interacts with a specific Endpoint to retrieve or store data.

5. The **requested information** flows back to the User **Interface**, where it is **displayed** or processed further.

These steps illustrate the flow of data and operations in the Clean Code Architecture, where the user interface interacts with the presentation layer, which then orchestrates the execution of the appropriate use case. The use case interacts with repositories, which in turn communicate with endpoints to retrieve or store data. Finally, the information flows back to the user interface for display or further actions.

By adhering to the principles of Clean Code Architecture, the Use Cases become the core of the application, enabling separation of concerns and facilitating future changes and enhancements without affecting other parts of the system.

### Domain

[link to the folder](src/app/domain/)

The Domain layer is the most stable and critical part of the system, responsible for defining the application's business logic. It encapsulates the core concepts, rules, and behaviors that govern the application's domain. The Domain layer should be independent and decoupled from the components in other layers, focusing solely on expressing the business requirements and rules.

#### Usecases

The Usecases in the Domain layer represent the application's business logic and encapsulate specific actions or use cases that the system can perform. They orchestrate the flow of data and operations between the Presentation and Data layers.

Here are some key points to understand about the Use Cases:

- Each Usecase class focuses on a specific action or behavior of the application, such as creating a user, processing a payment, or generating a report.
  
- Usecases are responsible for applying business rules and manipulating domain entities to fulfill their specific purposes.
  
- They serve as intermediaries between the user interface and the data layer, coordinating the necessary interactions and transformations.
  
- Usecases may interact with one or multiple Repositories from the Data layer to retrieve or store data.
  
- The usecases should be independent of any specific framework or external systems, ensuring their reusability and testability.
  
- They typically receive input parameters from the user interface and produce output that can be consumed by the presentation layer.
  
- When implementing usecases, it is essential to consider the Single Responsibility Principle (SRP) to ensure that each Use Case has a well-defined and focused responsibility. This allows for easier maintenance, testing, and evolution of the system.

The Domain layer should contain a dedicated folder or package for Use Cases. Each Use Case class should have clear and descriptive names, representing the specific action it performs.

#### Models

Models represent the key objects or concepts within the application's domain. They encapsulate both the data and behavior related to these objects. Models have unique identities and are responsible for maintaining their internal state consistency and enforcing business rules.

In the Domain layer, you will find various Model classes that models the core concepts of the application's domain. These Models should embody the business rules and constraints relevant to their respective areas. By encapsulating behavior and state within Models, the Domain layer ensures that the business logic remains cohesive and encapsulated.

Key characteristics and considerations regarding Models in the Domain layer include:

- **Data and Behavior Encapsulation:** Models encapsulate both data and behavior, ensuring that the essential attributes and operations related to the domain concept are contained within the Model itself. This encapsulation allows for better organization, clarity, and maintainability of the business logic.

- **Internal State Consistency:** Models are responsible for maintaining the internal state consistency of the objects they represent. They enforce business rules and constraints to ensure that the data within the Model remains valid and consistent. By encapsulating the state and behavior together, Models provide a cohesive and reliable representation of the business entities.

- **Enforcing Business Rules:** Models embody the business rules and constraints relevant to their respective areas. They implement the necessary validations, calculations, and transformations required by the domain logic. By encapsulating the business rules within Models, the Domain layer ensures that the core logic remains self-contained and independent of external dependencies.

- **Representing Core Domain Concepts:** Models in the Domain layer should model the core concepts and entities within the application's domain. They should accurately represent the essential aspects of the business, capturing the relationships, attributes, and behaviors that are critical to the system's functionality. Models act as a shared understanding of the domain concepts among stakeholders, developers, and users.

### Data

[link to the folder](./src/app/data/)


The Data layer serves as the outermost boundary of the application, responsible for communicating with various data sources such as device APIs, remote APIs, local databases, and more. It acts as the bridge between the application's business logic in the Domain layer and the external data sources.

#### Repositories:

Repositories provide an abstraction for data access and manipulation. They encapsulate the logic for retrieving and storing data from different sources, such as databases or external APIs. By using repositories, the Domain layer remains unaware of the specific data sources and implementation details, promoting flexibility and maintainability.

Here are key points to consider about repositories in the context of the Clean Code Architecture:

- **Abstraction of Data Access:** Repositories abstract away the complexities of interacting with various data sources. They provide a consistent and standardized interface for the Domain layer to communicate with the underlying data sources, irrespective of their specific implementation details. This abstraction enables the Domain layer to focus solely on the business logic without being tightly coupled to specific databases or APIs.

- **Data Source Agnosticism**: Repositories allow the Domain layer to remain unaware of the specific data sources being used. This means that the Domain layer does not have to be modified if the underlying data source changes. Whether the data is fetched from a SQL database, a NoSQL database, or an external API, the Domain layer can rely on the repository interface to perform the required operations, without being concerned about the implementation specifics.

- **Flexibility and Maintainability:** By decoupling the Domain layer from the data access implementation, repositories promote flexibility and maintainability. The underlying data sources can be changed or replaced without affecting the business logic. It also allows for easier unit testing of the Domain layer by providing the ability to mock or stub the repository interfaces.

- **Encapsulation of Data Logic:** Repositories encapsulate the logic related to data access, retrieval, storage, and transformation. They handle the complexity of querying databases, making API requests, and performing data mapping. The Domain layer can interact with the repositories using high-level operations that are specific to the business requirements, without needing to deal with the low-level details of data access.

By utilizing repositories, the Clean Code Architecture separates the concerns of data access and manipulation from the core business logic. This separation promotes modularity, testability, and maintainability by providing a clear boundary between the Domain layer and the underlying data sources. It allows for flexibility in adapting to different data sources, technologies, and evolving business requirements while ensuring that the business rules and logic remain independent and focused.

#### Entities:

Entities represent the data structures used within the Data layer. These Entities typically correspond to the data objects in the application's domain. They define the structure and attributes of the data being retrieved, updated, or stored by the repositories.

### Presentation

The Presentation layer plays a crucial role in **constructing user interfaces** to interact with users and **handling their response**s. It is the layer that is most dependent on the Angular framework and its syntax. It offers a multitude of implementation options to choose from.

The main **responsibilities** of the Presentation layer are:

- **User Interface Construction:** The Presentation layer is responsible for creating user interfaces that provide a visually appealing and intuitive experience for users. It involves designing screens, layouts, and components that allow users to interact with the application's functionality.

- **User Interaction Handling:** This layer captures user actions, such as button clicks, form submissions, or gestures, and processes them to trigger the appropriate actions within the application. It handles user input validation, error messages, and feedback to provide a seamless user experience.

- **Response Handling:** The Presentation layer receives responses from the underlying layers, such as the Domain and Data layers, and translates them into user-friendly representations. It formats and presents data to users, ensuring it is displayed in a meaningful and easily understandable manner.

## Credits

Developed by Monumento Software.
Design focused software studio.
From Recife, state of Pernambuco, Brazil.