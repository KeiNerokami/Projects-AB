**How to Read These Formulas**

Every formula below calculates the XP threshold for reaching the specified
level `n`; it does not necessarily represent the denominator shown in a
progress display. If a member is currently at level `n`, the display normally
uses the formula evaluated at the next level, `G_(n+1)`, as the required XP:

$$
\text{displayed XP} = \text{current cumulative XP} \, / \, G_{n+1}
$$

Therefore, a member can be shown as Level 8 with `2,209 / 2,220 XP`: `G_8`
is the Level 8 threshold, while `G_9 = 2,220` is the requirement to reach
Level 9. This same interpretation applies to every level-curve formula and,
for RNK formulas, to the next-level requirement within the current RNK
segment. The exact numerator may be the cumulative XP for the segment rather
than the XP earned since the current level.

**Base Formula**

$$
G_n = G_0 + (n - 1)M
$$

| Symbol | Meaning | Current value |
| --- | --- | --- |
| `G_n` | XP requirement for level `n` | Depends on level |
| `G_0` | Initial XP requirement | `180` |
| `n` | Target level | `1-100` |
| `M` | XP increment per level | `255` |

**Initial Level Formula Variants**

These formulas compare possible initial level curves. The current system uses
the first formula with `G_0 = 180` and `M = 255`.

| # | Formula | Description |
| --- | --- | --- |
| 1 | $$G_n = G_0 + (n - 1)M$$ | Current linear formula |
| 2 | $$G_n = G_0 + nM$$ | Direct level multiplier |
| 3 | $$G_n = G_0 M^{n-1}$$ | Multiplicative growth |
| 4 | $$G_n = G_0(1 + r)^{n-1}$$ | Percentage growth, where `r` is the growth rate |
| 5 | $$G_n = G_0 + M(n-1)^2$$ | Quadratic growth |
| 6 | $$G_n = G_0 + M(n-1)^3$$ | Cubic growth |
| 7 | $$G_n = G_0 + M(n-1)^p$$ | Polynomial growth, where `p` is the growth power |
| 8 | $$G_n = G_0 + M\log_b(n)$$ | Logarithmic growth, where `b` is the logarithm base |
| 9 | $$G_n = G_0 n^p$$ | Power-law growth, where `p` is the growth exponent |
| 10 | $$G_n = G_0 + f(n,M)$$ | Generic growth function |

Example using the current formula:

$$
G_{100} = 180 + (100 - 1)(255) = 25{,}425
$$

**Generalized RNK Formula**

The RNK-aware form leaves the effect of RNK open to a future progression
function.

$$
G_n^{(r)} = G_0 + f(n,M,r)
$$

| Symbol | Meaning |
| --- | --- |
| `G_n^(r)` | XP requirement for level `n` at RNK `r` |
| `G_0` | Initial XP requirement |
| `n` | Target level |
| `M` | Base XP progression |
| `r` | RNK |
| `f` | Progression function |

| # | Formula | Description |
| --- | --- | --- |
| 1 | $$G_n^{(r)} = (r + 1)[G_0 + (n - 1)M]$$ | Linear RNK scaling of the entire requirement |
| 2 | $$G_n^{(r)} = G_0 + (n - 1)M(r + 1)$$ | Linear RNK scaling of the level increment |
| 3 | $$G_n^{(r)} = G_0 + (n - 1)M(2^r)$$ | Exponential RNK scaling of the level increment |
| 4 | $$G_n^{(r)} = 2^r[G_0 + (n - 1)M]$$ | Exponential RNK scaling of the entire requirement |
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


**Inverse RNK Formulas**
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
