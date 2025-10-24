"""
Business: AI chat endpoint that generates character responses based on personality
Args: event with httpMethod, body (message, characterName, characterPersonality)
Returns: HTTP response with AI-generated character response
"""

import json
import os
from typing import Dict, Any
from openai import OpenAI

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        message = body_data.get('message', '')
        character_name = body_data.get('characterName', '')
        character_personality = body_data.get('characterPersonality', '')
        conversation_history = body_data.get('conversationHistory', [])
        
        if not message or not character_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
        
        client = OpenAI(api_key=api_key)
        
        system_prompt = f"""Ты — {character_name}. 

Твоя личность и характер:
{character_personality}

Правила общения:
- Всегда отвечай ОТ ЛИЦА персонажа {character_name}
- Соблюдай описанный характер и манеру общения
- Отвечай на русском языке
- Будь последовательным в характере
- Делай ответы живыми и эмоциональными
- Отвечай кратко (2-4 предложения), но содержательно
"""

        messages = [{"role": "system", "content": system_prompt}]
        
        for msg in conversation_history[-6:]:
            role = "assistant" if msg.get('sender') == 'character' else "user"
            messages.append({"role": role, "content": msg.get('text', '')})
        
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=300,
            temperature=0.8
        )
        
        character_response = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': character_response,
                'characterName': character_name
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
