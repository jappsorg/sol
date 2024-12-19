```mermaid
graph TD
    A[app/index.tsx] --> B[app/_layout.tsx]
    B --> C[app/home.tsx]
    B --> D[app/levels/index.tsx]
    B --> E[app/practice/[grade].tsx]
    B --> F[app/quiz/[grade].tsx]

    G[components/GradeCard] --> C
    H[components/WordDisplay] --> E
    H --> F
    I[components/ScoreBoard] --> E
    I --> F
    J[components/AnswerInput] --> E
    J --> F

    K[services/AnthropicService] --> E
    K --> F
    L[services/SpeechService] --> H

    M[utils/StorageUtil] --> E
    M --> F
    M --> C

    N[models/Types] --> K
    N --> M
    N --> H
    N --> I
```
