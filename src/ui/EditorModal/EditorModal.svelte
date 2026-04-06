<script lang="ts">
    import type { Snippet } from "svelte";

    interface EditorModalProps {
        title: string;
        acceptText?: string;
        cancelText?: string;
        onAccept?: () => void;
        acceptDisabled?: boolean;
        onCancel?: () => void;
        children?: Snippet;
    }

    const props: EditorModalProps = $props();
</script>

<div class="editor-modal">
    <div class="editor-modal__content">
        <div class="editor-modal__top_row">
            <h2>{props.title}</h2>
        </div>
        {@render props?.children()}
        <div class="editor-modal__bottom_row">
            <div class="editor-modal__buttons">
                {#if props.acceptText && props.onAccept}
                    <button onclick={props.onAccept} disabled={props.acceptDisabled}>{props.acceptText}</button>
                {/if}
                {#if props.cancelText && props.onCancel}
                    <button onclick={props.onCancel}>{props.cancelText}</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .editor-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .editor-modal {
        z-index: 1000;
    }

    .editor-modal__content {
        background: #ffffff;
        color: #111827;
        padding: 1.25rem;
        border-radius: 12px;
        width: min(94vw, 720px);
        max-height: 86vh;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.32);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        animation: modal-pop 180ms cubic-bezier(.16,.84,.3,1);
        overflow: hidden;
    }

    .editor-modal__top_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }
    .editor-modal__top_row h2 {
        margin: 0;
        font-size: 1.125rem;
        line-height: 1.2;
        font-weight: 600;
    }

    .editor-modal__content > :not(.editor-modal__top_row):not(.editor-modal__bottom_row) {
        flex: 1 1 auto;
        overflow: auto;
        padding-right: 0.25rem;
    }
    .editor-modal__bottom_row {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .editor-modal__buttons {
        display: flex;
        gap: 0.5rem;
    }
    .editor-modal__buttons button {
        appearance: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0.9rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: transform 100ms ease, background-color 120ms ease, box-shadow 120ms ease;
        box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    .editor-modal__buttons button:first-child {
        background: #0b73ff;
        color: white;
    }
    .editor-modal__buttons button:first-child:disabled {
        background: #0b73ff77;
        color: white;
    }
    .editor-modal__buttons button:last-child {
        background: transparent;
        color: #374151;
        border: 1px solid rgba(15,23,42,0.08);
    }
    /* .editor-modal__buttons button:hover {
        border: 2px solid rgba(15,23,42,0.08);
    }
    .editor-modal__buttons button:active {
        transform: translateY(0);
    } */

    @media (max-width: 480px) {
        .editor-modal__content {
            width: 94vw;
            padding: 1rem;
            border-radius: 10px;
        }
        .editor-modal__buttons {
            width: 100%;
            justify-content: space-between;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .editor-modal__content {
            animation: none;
        }
    }

    @keyframes modal-pop {
        from {
            transform: translateY(8px) scale(0.99);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }

    .editor-modal__content::-webkit-scrollbar {
        width: 10px;
    }
    .editor-modal__content::-webkit-scrollbar-thumb {
        background: rgba(15,23,42,0.08);
        border-radius: 8px;
    }
</style>