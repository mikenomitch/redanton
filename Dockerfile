FROM marcelocg/phoenix

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
ADD . /code

# Install any needed packages specified in requirements.txt
RUN mix deps.get

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Define environment variable
# ENV NAME World

# # Run app.py when the container launches
# CMD ["iex -S mix phoenix.server"]