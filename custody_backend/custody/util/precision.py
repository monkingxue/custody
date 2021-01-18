# -*- coding: utf-8 -*-
"""Precision Helper."""


def get_amount_str(amount, digits):
    # NOTE: Convert amount to string with fixed digits
    fmt_str = '%%.%df' % digits
    amount_str = fmt_str % amount
    if digits == 0:
        return amount_str
    amount_str = amount_str.rstrip("0")
    if amount_str.endswith("."):
        return amount_str.rstrip(".")
    return amount_str


def precision_amount(amount, digits, use_round=False):
    # NOTE: process amount with fixed digits
    if use_round is False:
        x = pow(10, digits)
        return int(amount * x) * 1.0 / x
    else:
        return round(amount, digits)


if __name__ == '__main__':
    print(get_amount_str(1009.2354, digits=2))
    print(get_amount_str(1009.2354, digits=5))
    print(precision_amount(1007.345, 2))
    print(precision_amount(1007.345, 2, use_round=True))
