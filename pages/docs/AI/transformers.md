## Traditional Machine Learning

Traditional ML models map inputs to an output, typically with something like a neural-network. traditional neural-networks have learned mappings and the linear layers provide a linear transformation of the data to determine the output. The model takes a single input token and applys the learned transformations for the output.

In text-based machine learning, a single input will be a token which is just a chunk of text. Text is split into tokens and then transformed into numerical vectors in the embedding layer. Embeddings include positioinal information as transformers have no understanding of the order of tokens.

## Transformers

Sequential tasks like sentiment analysis gets a bit trickier as the model loses context only seeing one token at a time. Sequential approaches make model training slow and long inputs can lose context on earlier inputs. Transformers solve these issues with a layer called attention which allows tokens to talk to each other. Each token can look at all other tokens in the attention layer to better understand context. Things like words in a sentence can identify their meaning based on other words in the sentence since tokens can exchange information about their meaning.

A very simplified way of putting it would be that transformers allow for determining the meaning of a word (e.g. "boot") from the context of it's surrounding tokens (could be about computers, could be about shoes...).

## Attention layer

Attention layer creates a query, key and value vector for each token in the sequence

Query - > what am I looking for
Key -> This is what I have
Values -> Meanings of token

So "Jake learns AI", 'learns' will have a query to identify the context, 'Jake' and 'AI' will display their key, and the value identifying the meaning behind the token (e.g. person).

Take the . product of a tokens query and the keys of all other tokens to identify the relevance.

Next the scores are normalised (softmax) to strongly highlight the relevance of each token to another.

The token will then update itself based on the values of the most relevant tokens.

The . product and weighted sums can be performed in parallel between all the tokens


## Resources

[1] A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, L. Kaiser, and I. Polosukhin, "Attention is all you need," arXiv, arXiv:1706.03762, Jun. 2017. [Online]. Available: https://arxiv.org/abs/1706.03762

[2] Hugging Face, "How do Transformers work?," in LLM Course, Chapter 1, Section 4. [Online]. Available: https://huggingface.co/learn/llm-course/en/chapter1/4. [Accessed: Apr. 25, 2026].

[3] 3Blue1Brown, "Transformers, the tech behind LLMs | Deep Learning Chapter 5," YouTube, Apr. 1, 2024. [Online]. Available: https://www.youtube.com/watch?v=wjZofJX0v4M. [Accessed: Apr. 25, 2026].
