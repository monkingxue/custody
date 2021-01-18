# local build login_code_notify
docker build -t login_code_notify -f custody/scripts/login_code_notify/Dockerfile .

docker stop login_code_notify
docker run --rm --name login_code_notify --net=host -d login_code_notify
