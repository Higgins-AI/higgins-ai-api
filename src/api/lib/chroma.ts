import {ChromaClient, OpenAIEmbeddingFunction} from "chromadb";

const chromaProUrl = process.env.CHROMADB_PRO_URL ?? ''
const openAiKey = process.env.OPENAI_API_KEY ?? ''

export const getRelatedDocs = async (
  inputString: string,
  organization: string
) => {
  console.log(organization);
  if (!organization) {
    return undefined;
  }
  const chromaClient = new ChromaClient({
    path: chromaProUrl,
  });
  const openAIEmbedder = new OpenAIEmbeddingFunction({
    openai_api_key: openAiKey,
  });
  const collection = await chromaClient.getCollection({
    name: organization,
    embeddingFunction: openAIEmbedder,
  });
  const documents = await collection.query({
    queryTexts: inputString,
    nResults: 5,
  });
  if (!documents.documents) {
    return undefined;
  }
  console.log(documents);
  return documents.documents;
};

export const getAllCollections = () => {
  const chromaClient = new ChromaClient({
    path: chromaProUrl,
  });
  return chromaClient.listCollections()
}