import { PineconeClient } from "pinecone-client";
import { Configuration, OpenAIApi } from "openai";

// Initialize Pinecone and OpenAI
const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
  environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT,
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
);

export default async function (req, res) {
  const { question } = req.body;

  try {
    // Generate an embedding for the question
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: question,
    });
    const questionEmbedding = embeddingResponse.data.data[0].embedding;

    // Query Pinecone to find relevant document sections
    const index = pinecone.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME);
    const queryResponse = await index.query({
      vector: questionEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    const relevantDocs = queryResponse.matches.map(
      (match) => match.metadata.content
    );

    // Use GPT-3 to generate an answer based on relevant document sections
    const answerPrompt = `Answer the following question based on these documents: ${relevantDocs.join(
      "\n"
    )}\nQuestion: ${question}`;
    const completionResponse = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: answerPrompt,
      max_tokens: 500,
    });

    const answer = completionResponse.data.choices[0].text;

    res.status(200).json({ answer, relevantDocs });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error answering question" });
  }
}
