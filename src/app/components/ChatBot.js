import { useState } from "react";
import OpenAI from "openai";

const ChatBot = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [prompt, setPrompt] = useState("");
  const [apiResponses, setApiResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const preliminaryInfo = "You are a bot for an app that gives people information on nearby social and outdoor events. If a user asks a question not related to social or outdoor events, please respond with a message saying \"Sorry, I am not programmed to answer this type of question. Please ask another one\"";
      const fullPrompt = preliminaryInfo + prompt;

      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: fullPrompt,
        max_tokens: 300,
      });
      const newApiResponse = completion.choices[0].text;
      setApiResponses([...apiResponses, newApiResponse]);
    } catch (e) {
      console.log(e);
      setApiResponses([...apiResponses, "Something is going wrong. Please try again."]);
    }
    setLoading(false);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <div className="box">
              <h2 className="subtitle">Message History</h2>
              <ul>
                {apiResponses.map((response, index) => (
                  <li key={index}>{response}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column is-half">
            <div className="box">
              <h2 className="subtitle">Chat</h2>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={prompt}
                      placeholder="Ask your question here!"
                      onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-primary ${loading ? 'is-loading' : ''}`}
                      disabled={loading || prompt.length === 0}
                      type="submit"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatBot;