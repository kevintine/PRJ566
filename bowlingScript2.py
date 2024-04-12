import requests
import json
import random
import time

base_url = 'http://localhost:8080'

def get_temp_users_count():
    """Fetch the count of temporary users from the backend."""
    url = f"{base_url}/api/temp-users/count"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()['count']
        else:
            print("Failed to fetch temp users count")
            return 0
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return 0

def add_frame_to_bowling_alley(bowling_alley_number, alley_index, frame_data):
    url = f"{base_url}/add-frame-to-bowling-alley/{bowling_alley_number}/{alley_index}"
    try:
        response = requests.post(url, json=frame_data)
        print(response.json())
    except requests.exceptions.RequestException as e:
        print('Error:', e)

def simulate_bowling():
    num_players = get_temp_users_count()
    if num_players == 0:
        print("No temporary users found in the database.")
        return

    for round in range(1, 10):
        print(f"Round {round}")
        for player in range(num_players):
            alley_index = player
            roll1 = random.randint(0, 10)
            roll2 = random.randint(0, 10 - roll1)
            frame_data = {
                "roll1": roll1,
                "roll2": roll2,
                "score": roll1 + roll2,
                "isStrike": roll1 == 10,
                "isSpare": roll1 != 10 and roll1 + roll2 == 10,
                "pinsKnockedDown": roll1 + roll2
            }
            print(f"Sending frame data for Player {player + 1} - Round {round}")
            add_frame_to_bowling_alley(1, alley_index, frame_data)
            time.sleep(0.5)

if __name__ == "__main__":
    simulate_bowling()
