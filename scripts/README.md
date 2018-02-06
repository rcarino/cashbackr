## Script for updating hardcoded list of cashback domains

1. Run script with node
2. It will notify you if the cashback domains list changed
3. (Optional) wait for script to flag any mismatches that results from ebates.com/{merchant}
   redirecting when attempting to hit https://{merchant}. Ex: ebates.com/amazon.htm does not
   match https://amazon.com. Therefore the CashBackR button won't flag amazon.com as cashback
   eligible without writing an exception to domainRedirectMap.json
4. Package src with updated assets and submit to play store for release
