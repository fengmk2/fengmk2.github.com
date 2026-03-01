sub fibonacci {
  my $n = shift;
  if ($n < 2) {
    return $n;
  }
  return fibonacci($n - 2) + fibonacci($n - 1);
}
print fibonacci(40), "\n";