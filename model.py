from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama.chat_models import ChatOllama
from langchain_core.runnables import RunnablePassthrough
from langchain.retrievers.multi_query import MultiQueryRetriever

def get_vector_db(documents):
    vector_db = Chroma.from_documents(
        documents=documents,
        embedding=OllamaEmbeddings(model="nomic-embed-text"),
        collection_name="pdf-local-rag"
    )
    return vector_db


def get_multi_query_retriever(vector_db,llm):
    QUERY_PROMPT = PromptTemplate(
        input_variables=["question"],
        template="""You are an AI language model assistant. Your task is to generate five
        different versions of the given user question to retrieve relevant documents from
        a vector database. By generating multiple perspectives on the user question, your
        goal is to help the user overcome some of the limitations of the distance-based
        similarity search. Provide these alternative questions separated by newlines.
        Original question: {question}"""
    )

    retriever = MultiQueryRetriever.from_llm(
    vector_db.as_retriever(), 
    llm,
    prompt=QUERY_PROMPT
    )
    return retriever

# RAG Prompt
def get_rag_prompt():
    template = """Answer the question based ONLY on the following context:
    {context}
    Question: {question}
    Ensure:
    - The response is a valid JSON inside triple backticks (` ```json ... ``` `).
    - "format" is either "QCM" (multiple-choice), "yesNo" (Yes/No), or "reponse_courte" (short response).
    - If "format" is "QCM", include 3 answer choices in "options".
    - Provide a relevant "explanation" for each question.
    """

    prompt = ChatPromptTemplate.from_template(template)
    return prompt


def get_answer(question,documents):
    local_model = "llama3:latest"
    llm = ChatOllama(model=local_model)
    vector_db = get_vector_db(documents)
    retriever = get_multi_query_retriever(vector_db,llm)
    rag_prompt = get_rag_prompt()

    chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
    | StrOutputParser()
    )

    
    answer = chain.invoke(question)
    return answer
