#!/bin/bash

ng build --configuration production

echo "####################"
echo "Building docker image"
echo "####################"

echo -n "Docker container name (pdsm-frontend): "
read container_name

if [ -z "$container_name" ]; then
    container_name="pdsm-frontend"
fi

while [[ -z "$version_tag" ]]; do
  echo -n "$container_name version tag: "
  read version_tag

  if [[ -z "$version_tag" ]]; then
    echo "Version tag cannot be empty!"
  fi
done

docker build -t $container_name:$version_tag .

echo "Deploying docker image..."
docker tag $container_name:$version_tag ucbjudge/$container_name:$version_tag
docker push ucbjudge/$container_name:$version_tag

if [ $? -eq 0 ]; then
  echo "Operation completed successfully!"
else
  echo "Operation failed."
fi
