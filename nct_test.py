from scipy import special, stats
from statsmodels.stats.power import TTestIndPower
import numpy as np

df = 16
# sample size in each grp
nobs1 = 9
nobs2 = 9
alpha = 0.05
effect_size = 1.56628701


def main():
  nobs = 1./ (1. / nobs1 + 1. / nobs2)

  crit_upp = stats.t.isf(alpha/2, df)
  print('crit_upp', crit_upp)
  crit_low_ppf = stats.t.ppf(alpha/2, df)
  print('crit_low_ppf', crit_low_ppf)
  # key
  crit_low = special.stdtrit(df, alpha/2)
  print('crit_low', crit_low)

  pow_upp = stats.nct._sf(crit_upp, df, effect_size*np.sqrt(nobs))
  print('pow_upp', pow_upp)
  pow_low = stats.nct._cdf(crit_low, df, effect_size*np.sqrt(nobs))
  print('pow_low', pow_low)

if __name__ == "__main__":
    main()
