FROM marcelocg/phoenix

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
ADD . /code

# Install any needed packages specified in requirements.txt
RUN mix deps.get
RUN mix compile

# # Run when the container launches
CMD ["echo Launching Container"]
