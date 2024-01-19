export const mainStyle = `
.laizypainter-tab {
  padding: 8px;
}
.laizypainter-tab-hidden {
    display: none !important;
}
.laizypainter-variable-item-row {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.laizypainter-variable-item {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    border-radius: 8px;
}
.laizypainter-variable-input {
    width: 100%
}
.laizypainter-variable-input-error {
    border-color: var(--error-text) !important;
}
.laizypainter-btn-selected{
    background-color: var(--border-color) !important;
}
.laizypainter-close-btn {
   font-size: 12px;
   display: flex;
   align-items: center;
   width: 24px;
   justify-content: center;
   background: var(--border-color);
   border-bottom-right-radius: 8px;
   border-top-right-radius: 8px;
   transform: translateX(-8px);
}

.laizypainter-close-btn::after {
  content: 'x';
}
.laizypainter-close-btn:hover {
  filter: brightness(1.2);
  cursor: pointer;
}
`
