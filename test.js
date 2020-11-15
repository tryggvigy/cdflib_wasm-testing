const CdfLibWrapper = require("cdflib_wasm");
const cdflib = new CdfLibWrapper({ compileSync: true });

const nobs1 = 9;
// const nobs2 = 9;
const alpha = 0.05;
const effect_size = 1.56628701;
// const nobs = 1 / (1 / nobs1 + 1 / nobs2);
// const df = nobs1 - 1 + nobs2 - 1;
// const crit_low = -2.1199052992210112;
// const crit_high = 2.1199052992210112;
// const nc = effect_size * Math.sqrt(nobs);
// console.log("crit_high", cdflib.cdft_2(df, alpha / 2));
// console.log("crit_low", cdflib.cdft_2(df, 1 - alpha / 2));
// console.log("power low", cdflib.cdftnc_1(df, nc, crit_low));
// console.log("power high", 1 - cdflib.cdftnc_1(df, nc, crit_high));

/**
 * Calculate power of a t-test
 *
 * @customfunction
 */
function ttest_power(effect_size, nobs, alpha, df, alternative) {
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
 * Statistical Power calculations for t-test for two independent sample
 *
 * @customfunction
 */
function ttest_ind_power(effect_size, alpha, nobs1, nobs2, df, alternative) {
  if (nobs2 === undefined) nobs2 = nobs1;
  // pooled variance
  if (df === undefined) df = nobs1 - 1 + nobs2 - 1;
  const nobs = 1 / (1 / nobs1 + 1 / nobs2);
  return ttest_power(effect_size, nobs, alpha, df, alternative);
}

console.log("ttest_ind_power", ttest_ind_power(effect_size, alpha, nobs1));
