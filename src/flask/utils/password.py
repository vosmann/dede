import sys
from werkzeug.security import generate_password_hash

hashing_method = 'pbkdf2:sha512:1000' # The integer is the number of iterations.
salt_length = 16


def hash_password(password):
    password_hash = generate_password_hash(password, hashing_method, salt_length)
    print password_hash 
    return password_hash 


password = sys.argv[1]
print "token is: " + password 
password_hash = hash_password(password)
print password_hash

