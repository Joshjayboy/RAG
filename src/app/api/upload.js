import multer from "multer";
import pdfParse from "pdf-parse";
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

// Set up Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

const handler = upload.single("file");
export default async function (req, res) {
  handler(req, res, async (err) => {
    if (err) return res.status(500).send({ message: "Error uploading file" });

    try {
      const { buffer, originalname } = req.file;
      const data = await pdfParse(buffer); // Parse PDF file

      // Use OpenAI's embedding model to convert document content into vector
      const content = data.text;
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content,
      });
      const embedding = response.data.data[0].embedding;

      // Save embedding in Pinecone
      const index = pinecone.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME);
      await index.upsert([
        { id: originalname, values: embedding, metadata: { content } },
      ]);

      res
        .status(200)
        .send({ message: "Document uploaded and indexed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error processing document" });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
