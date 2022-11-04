import json
from urllib.request import Request, urlopen

def lambda_handler(event, context):
    # TODO implement
    eventStr = json.dumps(event)
    url = 'http://checkip.amazonaws.com'
    with urlopen(Request(url)) as response:
     ipStr = response.read().decode('utf-8')
    print(eventStr + ipStr)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda! event is: ' + eventStr + 'and the ip address is: ' + ipStr)
    }
