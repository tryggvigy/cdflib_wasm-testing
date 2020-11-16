/**
 * Calculate power of a t-test
 */
function ttest_power_(effect_size, alpha, nobs, df, alternative) {
  const cdflib = getCdfLib();

  if (df === undefined) df = nobs - 1;
  if (alternative === undefined) alternative = "two-sided";

  const nc = effect_size * Math.sqrt(nobs);

  let alpha_ = alpha;
  if (["two-sided", "2s"].includes(alternative)) {
    alpha_ = alpha / 2;
  } else if (["smaller", "larger"].includes(alternative)) {
    alpha_ = alpha;
  } else {
    throw Error("alternative has to be 'two-sided', 'larger' or 'smaller'");
  }

  let pow_ = 0;
  if (["two-sided", "2s", "larger"].includes(alternative)) {
    // equivalen: stats.t.isf(alpha_, df);
    const crit_upp = cdflib.cdft_2(df, 1 - alpha_);
    if (Number.isNaN(crit_upp)) {
      // avoid endless loop, https://github.com/scipy/scipy/issues/2667
      pow_ = NaN;
    } else {
      //equivalen: stats.nct._sf(crit_upp, df, nc);
      pow_ = 1 - cdflib.cdftnc_1(df, nc, crit_upp);
    }
  }

  if (["two-sided", "2s", "smaller"].includes(alternative)) {
    // equivalen: stats.t.ppf(alpha_, df);
    const crit_low = cdflib.cdft_2(df, alpha_);
    if (Number.isNaN(crit_low)) {
      pow_ = NaN;
    } else {
      // equivalen: stats.nct._cdf(crit_low, df, nc);
      pow_ += cdflib.cdftnc_1(df, nc, crit_low);
    }
  }
  return pow_;
}

/**
 * Statistical Power calculations for t-test for two independent sample (pooled variance)
 *
 * @customfunction
 */
function ttest_ind_power(effect_size, alpha, nobs1, nobs2, df, alternative) {
  if (nobs2 === undefined) nobs2 = nobs1;
  // pooled variance
  if (df === undefined) df = nobs1 - 1 + nobs2 - 1;
  const nobs = 1 / (1 / nobs1 + 1 / nobs2);
  return ttest_power(effect_size, alpha, nobs, df, alternative);
}

/**
 * Statistical Power calculations for one sample or paired sample t-test
 *
 * @customfunction
 */
function ttest_power(effect_size, alpha, nobs, df, alternative) {
  return ttest_power_(effect_size, alpha, nobs, df, alternative);
}
