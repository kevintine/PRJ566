import requests
import json
import random

# Define the base URL of your application
base_url = 'http://localhost:8080'  # Update with your actual base URL

# Sample number of players
num_players = 4  # Update with the desired number of players
bowling_alley_number = 1  

# Function to add a frame to a specific bowling alley within a game
def add_frame_to_bowling_alley(bowling_alley_number, alley_index, frame_data):
    url = f"{base_url}/add-frame-to-bowling-alley/{bowling_alley_number}/{alley_index}"
    try:
        response = requests.post(url, json=frame_data)
        print(response.json())
    except requests.exceptions.RequestException as e:
        print('Error:', e)

# Simulate sending frame data for each player for 9 rounds of bowling
for round in range(1, 10):
    print(f"Round {round}")
    for player in range(num_players):
        # Update the bowling alley number and alley index for each player
        alley_index = player  # Calculate the alley index for each player in each round
        # Sample frame data for the current round
        roll1 = random.randint(0, 10)  # Random number between 0 and 10 for the first roll
        roll2 = random.randint(0, 10 - roll1)  # Random number between 0 and 10 for the second roll based on the first roll
        frame_data = {
            "roll1": roll1,
            "roll2": roll2,
            "score": 0,  # Score will be calculated by the backend
            "isStrike": False,  # Whether the frame is a strike
            "isSpare": False,  # Whether the frame is a spare
            "pinsKnockedDown": roll1 + roll2  # Total pins knocked down in the frame
        }
        # Send frame data for the current player and round to the backend
        print(f"Sending frame data for Player {player + 1} - Round {round}")
        add_frame_to_bowling_alley(bowling_alley_number, alley_index, frame_data)



