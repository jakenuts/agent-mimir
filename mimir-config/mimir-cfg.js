
const ChatOpenAI = require('langchain/chat_models/openai').ChatOpenAI;
const SeleniumWebBrowser = require('@agent-mimir/selenium-browser').SeleniumWebBrowser;
const OpenAIEmbeddings = require('langchain/embeddings/openai').OpenAIEmbeddings;
const Serper = require('langchain/tools').Serper;

const taskModel = new ChatOpenAI({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
    temperature: 0.9,
});
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
});
const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
    temperature: 0.9,
    modelName: process.env.AGENT_OPENAI_MODEL
});


module.exports = async function() {
    return {
        continuousMode: true,
        agents: {
            'Assistant': { 
                mainAgent: true, 
                description: 'An assistant', 
                definition: {
                    chatModel: chatModel,
                    taskModel: taskModel,
                    summaryModel: taskModel,
                    profession: 'an Assistant',
                    communicationWhitelist: ['MR_CHEF'], //The list of agents it is allowed to talk to.
                    chatHistory: {
                        maxChatHistoryWindow: 6, //Maximum size of the conversational chat before summarizing. 4 by default
                        maxTaskHistoryWindow: 6, //Maximum size of the task chat before summarizing. 4 by default
                    },
                    tools: [ 
                        new SeleniumWebBrowser({
                            model: taskModel,
                            embeddings: embeddings,
                            seleniumDriverOptions: {
                                browserName: "edge"
                            }
                        }),
                        new Serper(process.env.SERPER_API_KEY)
                    ]
                }
            }
        }
    }
}