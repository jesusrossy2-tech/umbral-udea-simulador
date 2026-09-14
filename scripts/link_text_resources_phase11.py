#!/usr/bin/env python3
"""Link each verified CL question to the verbatim source text it requires."""

from __future__ import annotations

import json
from pathlib import Path

from docx import Document


PROJECT = Path(__file__).resolve().parent.parent
SOURCE = Path('/Users/rg/Documents/Codex/2026-09-13/es/work/source')
BANK_PATH = PROJECT / 'data/question_bank.json'
RESOURCES_PATH = PROJECT / 'data/text_resources.json'

CONFIG = {
    'ExamenUdeA 2017 I  J1 print La utilidad de la luna.docx': {
        'resources': [
            ('UDEA_2017_1_J1_TEXT_1', 'Texto uno - La utilidad de la luna', 5, 21),
            ('UDEA_2017_1_J1_TEXT_2', 'Texto dos - Cambios en la lectura y educación universitaria', 133, 145),
        ],
        'ranges': [(1, 18, [0]), (19, 34, [1]), (35, 40, [0, 1])],
    },
    'ExamenUdeA 2017 II J1 print El arte.docx': {
        'resources': [
            ('UDEA_2017_2_J1_TEXT_1', 'Texto uno - ¿Cómo se llega a ser artista contemporáneo?', 5, 9),
            ('UDEA_2017_2_J1_TEXT_2', 'Texto dos - El mejor arte posible', 122, 126),
        ],
        'ranges': [(1, 18, [0]), (19, 35, [1]), (36, 40, [0, 1])],
    },
    'ExamenUdeA 2018 I J2 print Fútbol Galeano.docx': {
        'resources': [
            ('UDEA_2018_1_J2_TEXT_1', 'Texto uno - El fútbol', 5, 16),
            ('UDEA_2018_1_J2_TEXT_2', 'Texto dos - El hincha', 151, 158),
        ],
        'ranges': [(1, 22, [0]), (23, 36, [1]), (37, 40, [0, 1])],
    },
}

def paragraphs(document: Document, start: int, end: int) -> str:
    values = [' '.join(document.paragraphs[index].text.split()) for index in range(start, end + 1)]
    return '\n\n'.join(value for value in values if value)

bank = json.loads(BANK_PATH.read_text(encoding='utf-8'))
resources = []

for question in bank:
    question['text_resource_ids'] = []
    question['required_supporting_material'] = []
    question['supporting_material_status'] = 'not_required'

for filename, config in CONFIG.items():
    document = Document(SOURCE / filename)
    resource_ids = []
    for resource_id, title, start, end in config['resources']:
        content = paragraphs(document, start, end)
        if len(content) < 200:
            raise ValueError(f'Text resource is unexpectedly short: {resource_id}')
        resources.append({
            'id': resource_id,
            'type': 'text',
            'title': title,
            'content': content,
            'source_file': filename,
            'source_paragraphs': [start, end],
            'verbatim_confidence': 'verified',
        })
        resource_ids.append(resource_id)

    for question in bank:
        if question['source_file'] != filename or question['section'] != 'CL':
            continue
        number = question['original_question_number']
        indexes = next((items for low, high, items in config['ranges'] if low <= number <= high), None)
        if indexes is None:
            raise ValueError(f'No text range for {question["id"]}')
        question['text_resource_ids'] = [resource_ids[index] for index in indexes]
        question['required_supporting_material'] = ['text']
        question['supporting_material_status'] = 'complete_verified'

for question in bank:
    if question.get('visual_resources'):
        question['required_supporting_material'] = sorted(set(question['required_supporting_material'] + ['visual']))
        if question.get('verbatim_confidence') == 'verified':
            question['supporting_material_status'] = 'complete_verified'
    if question.get('official_exam_eligible') and question['section'] == 'CL' and not question['text_resource_ids']:
        raise ValueError(f'Eligible CL question lacks its source text: {question["id"]}')

BANK_PATH.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
RESOURCES_PATH.write_text(json.dumps(resources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'text_resources': len(resources), 'linked_cl_questions': sum(bool(q['text_resource_ids']) for q in bank)}, indent=2))
