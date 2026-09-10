**How to Read These Formulas**

Levels are zero-based. `G_n` is the XP cost to progress from level `n` to
level `n + 1`; it is not cumulative XP. The player's current-level XP resets
to `0` after a level-up, while the formula determines the requirement for the
next transition:

$$
\text{displayed XP} = \text{current-level XP} \, / \, G_n
$$

For example, the transition from level 6 to level 7 costs:

$$
G_6 = 180 + (6 \times 255) = 1{,}710 \text{ XP}
$$

The first transitions are `0 → 1 = 180 XP`, `1 → 2 = 435 XP`, and
`2 → 3 = 690 XP`. The same interpretation applies to every level-curve and
RNK formula: the displayed numerator is local progress, while cumulative XP
may still be retained separately for statistics and rank resolution.

**Base Formula**

$$
G_n = G_0 + nM
$$

| Symbol | Meaning | Current value |
| --- | --- | --- |
| `G_n` | XP cost from level `n` to level `n + 1` | Depends on level |
| `G_0` | Initial XP requirement | `180` |
| `n` | Current zero-based level | `0-99` |
| `M` | XP increment per level | `255` |

**Initial Level Formula Variants**

These formulas compare possible initial level curves. The current system uses
the first formula with `G_0 = 180` and `M = 255`. Each formula is interpreted
as the cost of the transition from zero-based level `n` to `n + 1`.

| # | Formula | Description |
| --- | --- | --- |
| 1 | $$G_n = G_0 + nM$$ | Current linear formula |
| 2 | $$G_n = G_0 + (n + 1)M$$ | Direct level multiplier |
| 3 | $$G_n = G_0 M^n$$ | Multiplicative growth |
| 4 | $$G_n = G_0(1 + r)^n$$ | Percentage growth, where `r` is the growth rate |
| 5 | $$G_n = G_0 + Mn^2$$ | Quadratic growth |
| 6 | $$G_n = G_0 + Mn^3$$ | Cubic growth |
| 7 | $$G_n = G_0 + Mn^p$$ | Polynomial growth, where `p` is the growth power |
| 8 | $$G_n = G_0 + M\log_b(n + 1)$$ | Logarithmic growth, where `b` is the logarithm base |
| 9 | $$G_n = G_0(n + 1)^p$$ | Power-law growth, where `p` is the growth exponent |
| 10 | $$G_n = G_0 + f(n,M)$$ | Generic growth function |

Example using the current formula:

$$
G_{99} = 180 + (99)(255) = 25{,}425
$$

**Message XP, Cooldown, and Repeated-Message Penalty**

The active message listener awards XP only after the user's message-source
cooldown has expired. Each `(guild, user, source)` has its own cooldown, and
message XP uses `source = message`.

The normal message reward is a weighted random roll:

| XP awarded | Probability |
| ---: | ---: |
| `1 XP` | `70%` |
| `2 XP` | `25%` |
| `3 XP` | `5%` |

The expected XP per accepted normal message is therefore:

$$
E[XP] = (1)(0.70) + (2)(0.25) + (3)(0.05) = 1.35 \text{ XP}
$$

The initial and refreshed base cooldown is selected uniformly between `1` and
`5` seconds:

$$
C_0 \sim \operatorname{Uniform}(1,5) \text{ seconds}
$$

An XP award is accepted only when the elapsed time since the previous award
for that user/source is at least the current cooldown `C`. A rejected message
awards `0 XP` and does not reset the successful-award timestamp.

Repeated-message detection compares the current message with the user's
previous message. It is considered repeated when both conditions hold:

- the messages arrive within `1` second;
- their case-insensitive similarity is at least `90%`.

For a repeated message, the reward is replaced with a fixed penalty reward
of `1 XP`, and the current cooldown penalty stacks by `1` second, capped at
the maximum cooldown of `10` seconds:

$$
C_{k+1} = \min(C_k + 1, 10) \text{ seconds}
$$

For example, if the initial cooldown is `1s`, successive detected spam
messages increase it to `2s`, `3s`, `4s`, and so on until it reaches `10s`.
The cooldown increase is stored when each repeated message is checked, even
if that message is rejected because the existing cooldown has not expired.
After an accepted normal message, the next base cooldown is randomized again
between `1` and `5` seconds. An accepted repeated message keeps the stacked
penalized cooldown for the next check.

In the current implementation, the `msgs` setting saved by the levelling
configuration command is descriptive only; the message listener still uses
the hard-coded weighted `1/2/3 XP` roll above. Message XP is also skipped
for bot messages, direct messages, and excluded channels.

The current Python constants still use a `5-10s` base range, so the runtime
must be updated separately if it is intended to follow this `1-5s` model.

**Generalized RNK Formula**

The RNK-aware form leaves the effect of RNK open to a future progression
function.

$$
G_n^{(r)} = G_0 + f(n,M,r)
$$

| Symbol | Meaning |
| --- | --- |
| `G_n^(r)` | XP cost from level `n` to level `n + 1` at RNK `r` |
| `G_0` | Initial XP requirement |
| `n` | Current zero-based level |
| `M` | Base XP progression |
| `r` | RNK |
| `f` | Progression function |

| # | Formula | Description |
| --- | --- | --- |
| 1 | $$G_n^{(r)} = (r + 1)[G_0 + (n - 1)M]$$ | Linear RNK scaling of the entire requirement |
| 2 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)$$ | Linear RNK scaling of the level increment |
| 3 | $$G_n^{(r)} = G_0 + (n - 1)M(2^r)$$ | Exponential RNK scaling of the level increment |
| 4 | $$G_n^{(r)} = 2^r[G_0 + nM]$$ | Active exponential RNK scaling of the entire requirement |
| 5 | $$G_n^{(r)} = G_0 + (n - 1)M S(r)$$ | Generic RNK scaling |
| 6 | $$G_n^{(r)} = G_0 + (n - 1)M S(r,n)$$ | Generic RNK and level scaling |
| 7 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^p$$ | Polynomial RNK scaling, where `p > 0` |
| 8 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^2$$ | Quadratic RNK scaling |
| 9 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^3$$ | Cubic RNK scaling |
| 10 | $$G_n^{(r)} = G_0 + (n - 1)M a^r$$ | Compound or exponential RNK growth, where `a > 1` |
| 11 | $$G_n^{(r)} = G_0 + (n - 1)M f(r)$$ | Custom RNK growth |
| 12 | $$M_r = M f(r)$$<br>$$G_n^{(r)} = G_0 + (n - 1)M_r$$ | RNK changes the increment itself |
| 13 | $$G_n^{(r)} = G_0 f(r) + (n - 1)M f(r)$$ | RNK changes both initial XP and growth |
| 14 | $$G_n^{(r)} = G_0 + M[(n - 1)^{r+1}]$$ | RNK and level exponential growth |
| 15 | $$G_n^{(r)} = G_0 + M(n - 1)S(r,n)$$ | RNK affects the curve, not just the scale |

For formula 13, the equivalent form is:

$$
G_n^{(r)} = f(r)[G_0 + (n - 1)M]
$$


**Inverse RNK Formulas (Cumulative-Total Model)**

The inverse formulas below apply only when XP is cumulative and directly
encodes level position. They do not apply to the reset-on-level-up model,
where level resolution uses the stored level plus current-level XP.
<!-- 
| Formula | Description |
| --- | --- |
| $$L(XP,r) = \left\lfloor \frac{XP - G_0}{M S(r)} \right\rfloor + 1$$ | Inverse generic RNK form |
| $$L(XP,r) = \left\lfloor \frac{XP - G_0}{M 2^r} \right\rfloor + 1$$ | Inverse exponential RNK scaling |
| $$L(XP,r) = \left\lfloor \frac{XP - G_0}{M(r + 1)} \right\rfloor + 1$$ | Inverse linear RNK scaling | -->

| # | Formula | Description | Inverse |
| --- | --- | --- | --- |
| 1 | $$G_n^{(r)} = (r + 1)[G_0 + (n - 1)M]$$ | Linear RNK scaling of the entire requirement | $$L(XP,r) = \left\lfloor \frac{XP/(r+1)-G_0}{M} \right\rfloor + 1$$ |
| 2 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)$$ | Linear RNK scaling of the level increment | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M(r+1)} \right\rfloor + 1$$ |
| 3 | $$G_n^{(r)} = G_0 + (n - 1)M(2^r)$$ | Exponential RNK scaling of the level increment | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M2^r} \right\rfloor + 1$$ |
| 4 | $$G_n^{(r)} = 2^r[G_0 + (n - 1)M]$$ | Exponential RNK scaling of the entire requirement | $$L(XP,r) = \left\lfloor \frac{XP/2^r-G_0}{M} \right\rfloor + 1$$ |
| 5 | $$G_n^{(r)} = G_0 + (n - 1)M S(r)$$ | Generic RNK scaling | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M S(r)} \right\rfloor + 1$$ |
| 6 | $$G_n^{(r)} = G_0 + (n - 1)M S(r,n)$$ | Generic RNK and level scaling | $$\text{No general closed-form inverse; depends on }S(r,n)$$ |
| 7 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^p$$ | Polynomial RNK scaling, where $p>0$ | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M(r+1)^p} \right\rfloor + 1$$ |
| 8 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^2$$ | Quadratic RNK scaling | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M(r+1)^2} \right\rfloor + 1$$ |
| 9 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)^3$$ | Cubic RNK scaling | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M(r+1)^3} \right\rfloor + 1$$ |
| 10 | $$G_n^{(r)} = G_0 + (n - 1)M a^r$$ | Compound or exponential RNK growth, where $a>1$ | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{Ma^r} \right\rfloor + 1$$ |
| 11 | $$G_n^{(r)} = G_0 + (n - 1)M f(r)$$ | Custom RNK growth | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M f(r)} \right\rfloor + 1$$ |
| 12 | $$M_r = M f(r)$$<br>$$G_n^{(r)} = G_0 + (n - 1)M_r$$ | RNK changes the increment itself | $$L(XP,r) = \left\lfloor \frac{XP-G_0}{M_r} \right\rfloor + 1$$ |
| 13 | $$G_n^{(r)} = G_0 f(r) + (n - 1)M f(r)$$ | RNK changes both initial XP and growth | $$L(XP,r) = \left\lfloor \frac{XP/f(r)-G_0}{M} \right\rfloor + 1$$ |
| 14 | $$G_n^{(r)} = G_0 + M[(n - 1)^{r+1}]$$ | RNK and level exponential growth | $$L(XP,r) = \left\lfloor \left(\frac{XP-G_0}{M}\right)^{1/(r+1)} \right\rfloor + 1$$ |
| 15 | $$G_n^{(r)} = G_0 + M(n - 1)S(r,n)$$ | RNK affects the curve, not just the scale | $$\text{No general closed-form inverse; depends on }S(r,n)$$ |


**Cumulative XP to RNK 10, Level 100**

The cumulative XP formula for reaching level `n` at RNK `R` is:

$$
XP_{\text{total}}(R,n) = \sum_{r=0}^{R-1} G_{100}^{(r)} + G_n^{(R)}
$$

For reaching Level 100 at the target RNK, this becomes:

$$
XP_{\text{total}}(R,100) = \sum_{r=0}^{R} G_{100}^{(r)}
$$

For the exponential entire-requirement formula, the Level 100 requirement at
RNK `r` is:

$$
G_{100}^{(r)} = 2^r[180 + (100 - 1)(255)] = 25{,}425 \cdot 2^r
$$

Because overall XP remains cumulative, reaching RNK 10, Level 100 includes
the completed Level 100 requirements for RNK 0 through RNK 10:

$$
\begin{aligned}
XP_{\text{total}} &= \sum_{r=0}^{10} 25{,}425 \cdot 2^r \\
&= 25{,}425(2^{11} - 1) \\
&= 52{,}044{,}975 \text{ XP}
\end{aligned}
$$
