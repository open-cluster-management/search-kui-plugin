#!/bin/bash

echo "This script sets up the search-kui-plugin Sonar environment.\n"

if [ -d "build/sonar-env" ]; then
  echo "\033[91msonar-env already exist at: build/sonar-env\033[0m"
  echo "Removing: build/sonar-env directory"
  rm -rf build/sonar-env
fi

echo "Creating build/sonar-env directory\n"
mkdir -p build/sonar-env
cd build/sonar-env

# DEFAULT VERSIONS
DEFAULT_SONARQUBE=sonarqube-8.3.1.34397
DEFAULT_SONARSCANNER=sonar-scanner-cli-4.3.0.2102-macosx

# BINARY VERSION LINKS
SONARQUBE_LINKS=https://binaries.sonarsource.com/Distribution/sonarqube/
SONARSCANNER_LINKS=https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/

# DIRECTORIES
SONARQUBE_DIR=$DEFAULT_SONARQUBE
SONARSCANNER_DIR=$DEFAULT_SONARSCANNER

function downloadComplete {
  if [ $2 -eq 0 ]; then
    echo "\033[92m$1 downloaded successfully\033[0m\n"
  elif [ $1 == "SonarQube" ]; then
    echo "\033[91m$1 Download failed...\033[0m"
    echo "Check to see if SonarQube binary exist: \033[34m$SONARQUBE_LINKS\033[0m"
  else
    echo "\033[91m$1 Download failed...\033[0m"
    echo "Check to see if SonarScanner binary exist: \033[34m$SONARSCANNER_LINKS\033[0m"
  fi
}

echo "Press enter to use the DEFAULT SonarQube and SonarScanner versions:\n\033[93mSonarQube Version:\033[0m $DEFAULT_SONARQUBE\n\033[93mSonarScanner Version:\033[0m $DEFAULT_SONARSCANNER"
read -r OUTPUT

if [ -z $OUTPUT ]; then
  echo "\033[93mDownloading SonarQube...\033[0m"
  wget https://binaries.sonarsource.com/Distribution/sonarqube/$DEFAULT_SONARQUBE.zip
  downloadComplete "SonarQube" $?

  echo "\033[93mDownloading SonarScanner...\033[0m"
  wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/$DEFAULT_SONARSCANNER.zip
  downloadComplete "SonarScanner" $?

else
  while [ true ]; do
    echo "\nEnter SonarQube version:\nEnter '?' or 'help' to view the link to the SonarQube binary versions"
    read -r OUTPUT

    if [ -z $OUTPUT ]; then
      echo "Version not selected... Defaulting to SonarQube version: $DEFAULT_SONARQUBE\n"
      VERSION=$DEFAULT_SONARQUBE
      break

    elif [ $OUTPUT != "?" ] && [ $OUTPUT != "help" ]; then
      VERSION=$OUTPUT
      echo "\nUsing SonarQube Version: $VERSION"
      break

    else
      echo "\nYou can find a list of the SonarQube binary version from this link: \033[34m$SONARQUBE_LINKS\033[0m"    
    fi
  done

  echo "\033[93mDownloading SonarQube...\033[0m"
  wget https://binaries.sonarsource.com/Distribution/sonarqube/$VERSION.zip
  downloadComplete "SonarQube" $?
  SONARQUBE_DIR=$VERSION

  while [ true ]; do
    echo "Enter SonarScanner version:\nEnter '?' or 'help' to view the link to the SonarScanner binary versions"
    read -r OUTPUT

    if [ -z $OUTPUT ]; then
      echo "Version not selected... Defaulting to SonarScanner version: $DEFAULT_SONARSCANNER\n"
      VERSION=$DEFAULT_SONARSCANNER
      break

    elif [ $OUTPUT != "?" ] && [ $OUTPUT != "help" ]; then
      VERSION=$OUTPUT
      echo "\nUsing SonarScanner version: $VERSION"
      break

    else
      echo "\nYou can find a list of the SonarScanner binary version from this link: \033[34m$SONARSCANNER_LINKS\033[0m"
    fi
  done

  echo "\033[93mDownloading SonarQube-Scanner...\033[0m"
  wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/$VERSION.zip
  downloadComplete "SonarScanner" $?
  SONARSCANNER_DIR=$VERSION
fi

unzip '*.zip'
rm *.zip

echo "\033[1;93mWould you like to run SonarQube? Enter 'y' if you wish to continue.\033[0m"
read -r ACCEPT
if [ "${ACCEPT}" != "y" ]; then
  echo "\nTo access SonarQube, run the sonar.sh script located in sonarqube-8.3.1.34397/bin/macosx-universal-64 directory."
  echo "./sonar.sh console\n./sonar.sh start\n\n"
  echo "To test the SonarScanner, open another tab and run npm run test:coverage. After the test has been completed, run sonar-scanner inside the tests directory"
  exit 0
fi

if [ -d $SONARQUBE_DIR ]; then
  cd $SONARQUBE_DIR 
  echo "Starting SonarQube console"
  sh bin/macosx-universal-64/sonar.sh console
else
  echo "\033[91mError:\033[0m Something went wrong when trying to run SonarQube... Check to see if $DIR/bin/macosx-universal-64/sonar.sh exist"
fi
