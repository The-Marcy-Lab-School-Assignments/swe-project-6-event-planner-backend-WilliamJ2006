**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

I conversed with AI regarding creating events because I wanted to have my database keep the previous value given if the new value is null. AI introduced me to the SQL `COALESCE` keyword, which returns the first non-null value in a list of expressions. This allows me to safely update fields by falling back to the current stored value whenever the incoming value is null, ensuring that no existing data is overwritten with nulls.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

I tested the keyword myself by applying it in an update query, where I passed both an incoming value and the existing column into COALESCE. When the new value was NULL, the database correctly retained the original value, and when it wasn’t, the field updated as expected. This confirmed that COALESCE works well for handling partial updates without overwriting existing data.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

The AI provided a general explanation and example of how the `COALESCE` keyword works and suggested using it in update quries when I described what I wanted to implement. I adapted the idea to fit my use case. I ensured the query matched my table schema and that it integrated properly with my event-handling logic. This process showed that while the AI was helpful in introducing the concept, I still needed to apply my own understanding of the database and context to use it effectively and properly. It also reinforced my understanding of how SQL handles null values.

**4. What did you learn from using AI in this way?**

I learned that AI can be a great tool for introducing new concepts and pointing me in the right direction when I’m unsure how to approach a problem. I also realized that it’s important to verify and adapt what the AI provides rather than using it as is because it can be wrong or halluciate when it doesn't have an answer for you. By testing the solution myself and modifying it to fit my use case, I was able to gain a deeper understanding of how `COALESCE` works and how to handle null values when updating effectively in SQL.
