import argparse
import random
import string

from custody.user.models import User


def run_once(username):
    from custody.admin.app import create_app
    app = create_app()
    with app.app_context():
        password = generate_password()
        User.create(
            username=username,
            email=username + '@sophontech.com',
            password=password,
            active=True
        )
    print('generate admin account success.Username: %s, Password: %s' % (username, password))


def generate_password():
    digits = string.digits
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase

    digits_num = random.randint(1,10)
    uppercase_num = random.randint(1,17 - digits_num - 1)
    lowercase_num = 17 - (digits_num + uppercase_num)

    _sample = random.sample
    password = _sample(digits, digits_num) + _sample(uppercase, uppercase_num) + _sample(lowercase, lowercase_num)

    random.shuffle(password)

    new_password = ''.join(password)

    return new_password


def get_custom_args():
    parser = argparse.ArgumentParser(description='generate admin account.')
    parser.add_argument('--username', dest='username', type=str)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = get_custom_args()
    if args.username:
        run_once(args.username)
