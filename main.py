from scipy import special, stats
from statsmodels.stats.power import TTestIndPower
import numpy as np

df = 18
# sample size in each grp
nobs1 = 10
nobs2 = 10
alpha = 0.05
effect_size = 0.6604256823


def main():
  nobs = 1./ (1. / nobs1 + 1. / nobs2)

  crit_upp = stats.t.isf(alpha/2, df)
  # t_isf = -special.stdtrit(df, alpha)
  print('crit_upp', crit_upp)

  pow_upp = stats.nct._sf(crit_upp, df, effect_size*np.sqrt(nobs))
  print('pow_upp', pow_upp)

  # crit_low = stats.t.ppf(alpha/2, df)
  crit_low = special.stdtrit(df, alpha/2)
  print('crit_low', crit_low)

  pow_low = stats.nct._cdf(crit_low, df, effect_size*np.sqrt(nobs))
  print('pow_low', pow_low)

  pow = pow_upp + stats.nct._cdf(crit_low, df, effect_size*np.sqrt(nobs))
  print('pow', pow)

  # Final
  analysis = TTestIndPower()
  observed_power = analysis.solve_power(effect_size, nobs1=nobs1, alpha=alpha)
  print('observed_power', observed_power)

if __name__ == "__main__":
    main()
