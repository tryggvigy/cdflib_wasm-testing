const getCdfLib = require("./cdflib");

/**
 * Calculate power of a t-test
 */
function ttest_power_(effect_size, alpha, nobs, df, alternative) {
  const cdflib = getCdfLib();

  if (typeof df !== "number") df = nobs - 1;
  if (!alternative) alternative = "two-sided";

  if (["two-sided", "2s"].includes(alternative)) {
    alpha = alpha / 2;
  } else if (["smaller", "larger"].includes(alternative)) {
    alpha = alpha;
  } else {
    throw Error("alternative has to be 'two-sided', 'larger' or 'smaller'");
  }

  // non-centrality parameter.
  const nc = effect_size * Math.sqrt(nobs);

  let power = 0;

  if (["two-sided", "2s", "larger"].includes(alternative)) {
    // equivalen: stats.t.isf(alpha_, df);
    const crit_upp = cdflib.cdft_2(df, 1 - alpha);
    if (Number.isNaN(crit_upp)) {
      // avoid endless loop, https://github.com/scipy/scipy/issues/2667
      power = NaN;
    } else {
      //equivalen: stats.nct._sf(crit_upp, df, nc);
      power = 1 - cdflib.cdftnc_1(df, nc, crit_upp);
    }
  }

  if (["two-sided", "2s", "smaller"].includes(alternative)) {
    // equivalen: stats.t.ppf(alpha_, df);
    const crit_low = cdflib.cdft_2(df, alpha);
    if (Number.isNaN(crit_low)) {
      power = NaN;
    } else {
      // equivalen: stats.nct._cdf(crit_low, df, nc);
      power += cdflib.cdftnc_1(df, nc, crit_low);
    }
  }
  return power;
}

/**
 * Statistical Power calculations for t-test for two independent sample (pooled variance)
 *
 * @param {number} effect_size standardized effect size, difference between the two means divided by the standard deviation (Cohen's d)
 * @param {number} alpha significance level, e.g. 0.05, is the probability of a type I error, that is wrong rejections if the Null Hypothesis is true.
 * @param {number} nobs1 number of observations in sample 1
 * @param {number} nobs2 (optional, default=nobs1) number of observations in sample 2
 * @param {number} df (optional) degrees of freedom. If not specified, the df from the ttest with pooled variance is used, df = (nobs1 - 1 + nobs2 - 1)
 * @param {string} alternative (optional) ‘two-sided’ (default), ‘larger’, ‘smaller’. Extra argument to choose whether the power is calculated for a two-sided (default) or one sided test. The one-sided test can be either ‘larger’, ‘smaller’.
 * @return {number} power of the test, e.g. 0.8, is one minus the probability of a type II error. Power is the probability that the test correctly rejects the Null Hypothesis if the Alternative Hypothesis is true.
 * @customfunction
 */
function ttest_ind_power(effect_size, alpha, nobs1, nobs2, df, alternative) {
  if (typeof nobs2 !== "number") nobs2 = nobs1;
  // pooled variance
  if (typeof df !== "number") df = nobs1 - 1 + nobs2 - 1;
  const nobs = 1 / (1 / nobs1 + 1 / nobs2);
  return ttest_power(effect_size, alpha, nobs, df, alternative);
}

/**
 * Statistical Power calculations for one sample or paired sample t-test
 *
 * @param {number} effect_size standardized effect size, difference between the two means divided by the standard deviation (Cohen's d)
 * @param {number} alpha significance level, e.g. 0.05, is the probability of a type I error, that is wrong rejections if the Null Hypothesis is true.
 * @param {number} nobs1 number of observations in sample 1
 * @param {number} nobs2 (optional, default=nobs1) number of observations in sample 2
 * @param {number} df (optional) degrees of freedom. If not specified, the df from the one sample or paired ttest is used, df = nobs1 - 1
 * @param {string} alternative (optional) ‘two-sided’ (default), ‘larger’, ‘smaller’. Extra argument to choose whether the power is calculated for a two-sided (default) or one sided test. The one-sided test can be either ‘larger’, ‘smaller’.
 * @return {number} power of the test, e.g. 0.8, is one minus the probability of a type II error. Power is the probability that the test correctly rejects the Null Hypothesis if the Alternative Hypothesis is true.
 * @customfunction
 */
function ttest_power(effect_size, alpha, nobs, df, alternative) {
  return ttest_power_(effect_size, alpha, nobs, df, alternative);
}
