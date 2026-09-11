A light walkthrough of the core PyTorch concepts needed to understand how models are built and trained.

## Tensors

Everything in PyTorch is a tensor. They can be created from data, or generated with a given shape:

```python
data = [[1, 2, 3], [4, 5, 6]]
my_tensor = torch.tensor(data)

shape = (2, 3)
ones = torch.ones(shape)
zeros = torch.zeros(shape)
random = torch.randn(shape)
```

Tensors have a shape, datatype and device. The default dtype is `float32` — deliberate for small number increments (useful for model weights and biases):

```python
tensor = torch.randn(2, 3)
print(tensor.shape)   # torch.Size([2, 3])
print(tensor.dtype)   # torch.float32
print(tensor.device)  # cpu
```

## Autograd

PyTorch has a built-in automatic gradient calculator. Any learnable tensor gets `requires_grad=True`, and PyTorch tracks everything that happens to it, building a computation graph:

```python
# z = x * y, where y = a + b
a = torch.tensor(2.0, requires_grad=True)
b = torch.tensor(3.0, requires_grad=True)
x = torch.tensor(4.0, requires_grad=True)

y = a + b
z = x * y

print(z.grad_fn)  # <MulBackward0> - created by operation
print(a.grad_fn)  # None - created by user
```

Each operation records a `grad_fn` so gradients can flow backwards through the graph.

## Operations

Element-wise operations apply per-element, while matrix multiplication powers neural networks:

$$
C_{ij} = \sum_{k} A_{ik} \, B_{kj}
$$

Each output element is a dot product — a row of $A$ paired element-by-element with a column of $B$ and summed up. This weighted sum is what lets a neural network layer mix every input feature into every output feature, with the weights controlling how much each input counts.

```python
element_wise_product = a * b          # element-wise
m_product = m1 @ m2                   # matrix multiplication
```

Reductions collapse a tensor to fewer elements. `dim` controls which direction to collapse — `dim=0` collapses rows, `dim=1` collapses columns:

```python
scores = torch.tensor([[10., 20., 30.], [5., 10., 15.]])
avg_per_assignment = scores.mean(dim=0)  # tensor([ 7.5, 15. , 22.5])
avg_per_student = scores.mean(dim=1)     # tensor([20., 10.])
```

Handy indexing tools — `argmax` finds the index of the highest value (e.g. a model's prediction), `gather` selects values by index:

```python
best_idx = torch.argmax(scores, dim=1)
selected = torch.gather(data, dim=1, index=ind_to_select)
```

## Linear regression from scratch

The **forward pass** is the model's first guess — a linear transformation of the input:

$$
\hat{y} = XW + b
$$

where $X$ is the input data, $W$ the weights, $b$ the bias and $\hat{y}$ the prediction. Each weight in $W$ scales how strongly an input feature influences the output, while the bias $b$ shifts the output independently of any input — letting the line fit data that doesn't pass through the origin. The model never sees the true values — it must discover them from the data:

```python
# Fake data with hidden true values: W=2, b=1
X = torch.randn(N, D_in)
true_W = torch.tensor([[2.0]])
true_b = torch.tensor(1.0)
y_true = X @ true_W + true_b + torch.randn(N, D_out) * 0.1

# Initial hypothesis
W = torch.randn(D_in, D_out, requires_grad=True)
b = torch.randn(1, requires_grad=True)

y_hat = X @ W + b
```

The **backward pass** tunes the weights for another guess. The mean squared error tells us how wrong we are:

$$
\mathcal{L} = \frac{1}{N} \sum_{i=1}^{N} (\hat{y}_i - y_i)^2
$$

For each datapoint, the error $\hat{y}_i - y_i$ is squared — this keeps positive and negative mistakes from cancelling each other out, and punishes large errors far more than small ones. Averaging over all $N$ samples then condenses "how wrong are we?" into a single number: the lower, the better the guess.

```python
loss = torch.mean((y_hat - y_true) ** 2)
loss.backward()   # gradients flow back through the graph
```

The gradient points towards the steepest *increase*, so we travel in the opposite direction — **gradient descent**, with learning rate $\eta$:

$$
W_{new} = W_{old} - \eta \, \frac{\partial \mathcal{L}}{\partial W}, \qquad b_{new} = b_{old} - \eta \, \frac{\partial \mathcal{L}}{\partial b}
$$

The partial derivative $\frac{\partial \mathcal{L}}{\partial W}$ answers the question *"how much does the loss change if I nudge this weight?"*. Multiplying by the learning rate $\eta$ keeps each step small and controlled — too big and you overshoot the minimum, too small and training crawls. Subtracting moves every parameter downhill, against the gradient.

```python
learning_rate, epochs = 0.01, 100

for epoch in range(epochs):
    y_hat = X @ W + b
    loss = torch.mean((y_hat - y_true) ** 2)
    loss.backward()

    with torch.no_grad():  # don't track during manual update
        W -= learning_rate * W.grad
        b -= learning_rate * b.grad

    W.grad.zero_()   # reset gradients for the next epoch
    b.grad.zero_()
```

Think of the loss as altitude and the gradient as steepness — the target is to get to the bottom of the valley.

## torch.nn building blocks

`torch.nn` packages loose weight/bias tensors into layers. A `Linear` layer auto-registers its parameters and computes $\hat{y} = XW + b$:

```python
lin_layer = torch.nn.Linear(in_features=1, out_features=1)
y_hat = lin_layer(X)
```

### Activations

Activation functions handle non-linear problems.

**ReLU** (Rectified Linear Unit) sets negative values to 0:

$$
f(x) = \max(0, x)
$$

This acts as a simple on/off switch — positive signals pass through untouched, negative ones are blocked. Stacking linear layers alone just gives you another linear function; inserting this cheap non-linearity is what lets the network bend and fold the data to fit non-linear patterns.

**GELU** (Gaussian Error Linear Unit), the modern standard for GPT-style models, weights each input by the standard normal CDF $\Phi(x)$:

$$
\text{GELU}(x) = x \, \Phi(x)
$$

$\Phi(x)$ is the probability that a normally distributed value falls below $x$. So instead of ReLU's hard cutoff, each input is multiplied by how "typical" it is — large negatives fade smoothly to zero, positives pass through almost untouched, and small negatives partially survive. That smoothness makes gradients flow better, which matters a lot when training massive models.

```python
relu = torch.nn.ReLU()
relu(torch.tensor([-2.0, 0.5, 2.0]))   # tensor([0.0, 0.5, 2.0])

gelu = torch.nn.GELU()
gelu(torch.tensor([-2.0, 0.5, 2.0]))   # tensor([-0.0455, 0.3457, 1.9545])
```

**Softmax** converts logits into a probability distribution — values between 0 and 1 that sum to exactly 1. Used for the final classification layer:

$$
\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_{j} e^{z_j}}
$$

Exponentiating each logit makes every value positive and exaggerates the gaps between them — the biggest logit pulls even further ahead. Dividing by the total then turns each into its share of the whole, so the model's confidence in each class can be read straight off as a probability.

```python
softmax = torch.nn.Softmax(dim=-1)
prob = softmax(logits)
print(prob[0].sum())   # tensor(1.)
```

### Embedding

Embeddings turn words into numbers — each word gets a unique learnable vector. It's essentially a lookup table $E \in \mathbb{R}^{V \times d}$ over the vocabulary:

$$
\text{Embedding}(i) = E_i
$$

Row $i$ of the table $E$ (vocab size $V$, dimension $d$) holds the vector representing token $i$, so "embedding a word" is nothing more than fetching its row. The vectors start out random and are tuned during training, so tokens used in similar contexts end up with similar vectors — meaning becomes geometry.

```python
embedding_layer = torch.nn.Embedding(vocab_size=10, embedding_dim=3)
word_vectors = embedding_layer(torch.tensor([[1, 5, 0, 8]]))
```

### LayerNorm

Values can explode or vanish as they move through a network. LayerNorm rescales them to a stable range using the mean $\mu$ and standard deviation $\sigma$ across the feature dimension:

$$
\hat{x} = \gamma \, \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta
$$

Subtracting the mean recentres the features on zero, and dividing by the standard deviation squashes them to a consistent width (with $\epsilon$ guarding against division by zero). The learnable $\gamma$ and $\beta$ then rescale and shift the result, so the network can undo the normalisation if it ever gets in the way:

```python
norm_layer = torch.nn.LayerNorm(normalized_shape=3)
normalized = norm_layer(input_features)
```

### Dropout

Dropout prevents overfitting by randomly zeroing neurons (with probability $p$) during training, preventing over-reliance on a single neuron. Surviving values are scaled to keep the expected sum — only active during training:

$$
\text{dropout}(x) = \frac{m \odot x}{1 - p}, \quad m_i \sim \text{Bernoulli}(1 - p)
$$

Each entry of the mask $m$ is an independent coin flip that keeps its neuron with probability $1 - p$, and the element-wise product $m \odot x$ applies the mask. Dividing by $1 - p$ boosts the survivors so the overall scale of the activations stays the same — meaning nothing has to change at inference time when dropout is switched off.

```python
dropout_layer = torch.nn.Dropout(p=0.5)

dropout_layer.train()   # randomly zeroes ~50% of inputs
output = dropout_layer(input_tensor)

dropout_layer.eval()    # passes inputs through unchanged
output = dropout_layer(input_tensor)
```

## Modules & optimisers

`nn.Module` organises layers into a model — define the layers in `__init__` and connect them in `forward`. `torch.optim` automates the learning:

```python
class LinearRegressionModel(nn.Module):
    def __init__(self, in_features, out_features):
        super().__init__()
        self.linear_layer = nn.Linear(in_features, out_features)

    def forward(self, x):
        return self.linear_layer(x)

model = LinearRegressionModel(in_features=1, out_features=1)
optimizer = optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

for epoch in range(100):
    y_hat = model(X)          # forward pass
    loss = loss_fn(y_hat, y_true)
    optimizer.zero_grad()     # reset gradients
    loss.backward()           # compute gradients
    optimizer.step()          # update parameters
```

## Feed-forward network

The FFN used inside a transformer block — expand, activate, compress. A model's power comes from stacking these blocks with self-attention, all built on `nn.Linear` layers:

$$
\text{FFN}(x) = W_2 \, \text{GELU}(W_1 x + b_1) + b_2
$$

$W_1$ expands each token into a wider dimension, giving the network room to detect richer features than fit in the original representation. GELU then filters those features non-linearly, and $W_2$ projects the result back down to the embedding size — so the output can be passed straight into the next block.

```python
class FeedForwardNetwork(nn.Module):
    def __init__(self, embedding_dim, ffn_dim):
        super().__init__()
        self.layer1 = nn.Linear(embedding_dim, ffn_dim)
        self.activation = nn.GELU()
        self.layer2 = nn.Linear(ffn_dim, embedding_dim)

    def forward(self, x):
        return self.layer2(self.activation(self.layer1(x)))
```

## Resources

[1] PyTorch, "Learn the Basics — Tensors," in PyTorch Tutorials. [Online]. Available: https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html

[2] D. Hendrycks and K. Gimpel, "Gaussian Error Linear Units (GELUs)," arXiv, arXiv:1606.08415, Jun. 2016. [Online]. Available: https://arxiv.org/abs/1606.08415

[3] Z. Huang, "PyTorch in 1 Hour," YouTube. [Online]. Available: https://www.youtube.com/watch?v=r1bquDz5GGA. [Accessed: Sep. 11, 2026]
