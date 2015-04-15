import sys
from werkzeug.security import generate_password_hash

salt_length = 16


def hash_password(password):
    password_hash = generate_password_hash(password, hashing_method, salt_length)
    print password_hash 
    return password_hash 


hashing_method = sys.argv[1] # The integer is the number of iterations.
password = sys.argv[2]
print "token is: " + password 
password_hash = hash_password(password)
print password_hash

# Print out  the full JSON instead.
# { "_id" : "x", "id" : "x", "password_hash" : "pbkdf2:sha256:NR_ITER$HASHED_PASS" }

